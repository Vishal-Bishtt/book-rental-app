const prisma = require('../../prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Check if user already exists with this email
    const userExists = await prisma.user.findUnique({
      where: { email }
    });
    
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Value being inserted into password column:", hashedPassword); // for debugging
    
    const newUser = await prisma.user.create({
      data: {
        username: username || email.split('@')[0], // Use email prefix as fallback username
        email,
        password: hashedPassword,
        role: 'user'
      }
    });

    // Remove password from response
    const { password: _, ...userData } = newUser;
    
    res.status(201).json({ 
      message: 'User registered successfully',
      user: userData
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if it's admin login from .env
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const adminUser = {
        id: 'admin',
        email: process.env.ADMIN_EMAIL,
        username: 'Administrator',
        role: 'admin'
      };

      const token = jwt.sign({ 
        id: adminUser.id, 
        email: adminUser.email, 
        role: adminUser.role 
      }, process.env.JWT_SECRET, { expiresIn: '7d' });
      
      // Set JWT in HTTP-only cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      return res.json({ 
        token,
        user: adminUser,
        message: 'Admin login successful' 
      });
    }

    // Regular user login - find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user has a password (not OAuth-only user)
    if (!user.password) {
      return res.status(400).json({ 
        message: 'This email is associated with a Google account. Please sign in with Google.' 
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ 
      id: user.id, 
      email: user.email, 
      role: user.role 
    }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    // Set JWT in HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Return user data without password
    const { password: _, ...userData } = user;
    res.json({ 
      token,
      user: userData,
      message: 'Login successful' 
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.logoutUser = async (req, res) => {
  try {
    // Clear the token cookie
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    res.json({ message: 'Logout successful' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.verifyUser = async (req, res) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Handle admin user
    if (decoded.id === 'admin') {
      const adminUser = {
        id: 'admin',
        email: process.env.ADMIN_EMAIL,
        username: 'Administrator',
        role: 'admin'
      };
      return res.json({ 
        user: adminUser,
        token,
        authenticated: true 
      });
    }

    // Regular user verification
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        created_at: true,
        updated_at: true
      }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ 
      user,
      token,
      authenticated: true 
    });
  } catch (err) {
    console.error('Token verification error:', err);
    res.status(401).json({ message: 'Invalid token' });
  }
};
  