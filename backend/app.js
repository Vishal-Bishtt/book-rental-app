const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require("express-session");
const passport = require("passport");
require("./config/passport");

dotenv.config(); 

const authRoute = require('./routes/auth/auth.routes'); 
const oauthRoutes = require('./routes/auth/auth2');
const bookRoute = require('./routes/book');
const userRoute = require('./routes/user');
const rentalRoute = require('./routes/rental');
const adminRoute = require('./routes/admin');

const app = express();

app.use(cors({
  origin: "http://localhost:3000", // your frontend URL
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Session configuration for OAuth (optional, mainly for compatibility)
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret-key-here',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/auth", oauthRoutes);  // Google OAuth2 routes
app.use('/api/auth', authRoute); // Traditional email/password auth
app.use('/api/books', bookRoute);
app.use('/api/user', userRoute);
app.use('/api/rental', rentalRoute);
app.use('/api/rentals', rentalRoute); // Alternative route
app.use('/api/returns', rentalRoute); // For return endpoints
app.use('/api/admin', adminRoute); // Admin routes

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
