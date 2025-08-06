const prisma = require('../prisma/client');

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Admins only' });
    }

    // Get total counts using Prisma
    const [userCount, bookCount, activeRentals, totalRentals] = await Promise.all([
      prisma.user.count(),
      prisma.book.count(),
      prisma.rental.count({ where: { status: 'active' } }),
      prisma.rental.count()
    ]);

    // Get all rentals with user and book details
    const rentalsWithDetails = await prisma.rental.findMany({
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true
          }
        },
        book: {
          select: {
            id: true,
            title: true,
            author: true,
            genre: true
          }
        }
      },
      orderBy: {
        rented_at: 'desc'
      }
    });

    // Transform the data to match the expected format for frontend
    const transformedRentals = rentalsWithDetails.map(rental => ({
      id: rental.id,
      rented_at: rental.rented_at,
      returned_at: rental.returned_at,
      due_date: rental.due_date,
      status: rental.status,
      user_name: rental.user.username || rental.user.email, // Fallback to email if no username
      user_email: rental.user.email,
      book_title: rental.book.title,
      book_author: rental.book.author,
      book_genre: rental.book.genre
    }));

    res.json({
      stats: {
        totalUsers: userCount,
        totalBooks: bookCount,
        activeRentals: activeRentals,
        totalRentals: totalRentals
      },
      rentals: transformedRentals
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Admins only' });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        created_at: true
      },
      orderBy: {
        created_at: 'desc'
      }
    });
    
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all books for admin management
exports.getAllBooksAdmin = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Admins only' });
    }

    const books = await prisma.book.findMany({
      orderBy: {
        created_at: 'desc'
      }
    });
    
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create new book (admin only)
exports.createBookAdmin = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Admins only' });
    }

    const { title, author, genre, is_available = true } = req.body;
    
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const book = await prisma.book.create({
      data: {
        title,
        author,
        genre,
        is_available
      }
    });

    res.status(201).json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update book (admin only)
exports.updateBookAdmin = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Admins only' });
    }

    const { id } = req.params;
    const { title, author, genre, is_available } = req.body;

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (author !== undefined) updateData.author = author;
    if (genre !== undefined) updateData.genre = genre;
    if (is_available !== undefined) updateData.is_available = is_available;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    try {
      const book = await prisma.book.update({
        where: { id: parseInt(id) },
        data: updateData
      });

      res.json(book);
    } catch (error) {
      if (error.code === 'P2025') { // Prisma record not found error
        return res.status(404).json({ message: 'Book not found' });
      }
      throw error;
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete book (admin only)
exports.deleteBookAdmin = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Admins only' });
    }

    const { id } = req.params;

    // Check if book is currently rented
    const activeRental = await prisma.rental.findFirst({
      where: {
        bookId: parseInt(id),
        status: 'active'
      }
    });
    
    if (activeRental) {
      return res.status(400).json({ message: 'Cannot delete book that is currently rented' });
    }

    try {
      const book = await prisma.book.delete({
        where: { id: parseInt(id) }
      });

      res.json({ message: 'Book deleted successfully', book });
    } catch (error) {
      if (error.code === 'P2025') { // Prisma record not found error
        return res.status(404).json({ message: 'Book not found' });
      }
      throw error;
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
