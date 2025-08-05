const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admincontroller');
const authenticateToken = require('./auth/auth.middleware');

// All admin routes require authentication
router.use(authenticateToken);

// Dashboard routes
router.get('/dashboard/stats', adminController.getDashboardStats);
router.get('/users', adminController.getAllUsers);

// Admin book management routes
router.get('/books', adminController.getAllBooksAdmin);
router.post('/books', adminController.createBookAdmin);
router.put('/books/:id', adminController.updateBookAdmin);
router.delete('/books/:id', adminController.deleteBookAdmin);

module.exports = router;
