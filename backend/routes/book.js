const express = require('express');
const{
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook
} = require('../controllers/bookcontroller');

const authenticateToken = require('./auth/auth.middleware'); // protect routes if needed
const authorizationAdmin =require('./auth/authorizeAdmin');
const router = express.Router();

router.get('/', getAllBooks);
router.get('/:id', getBookById);
router.post('/', authenticateToken,authorizationAdmin, createBook); // Only logged-in users
router.put('/:id', authenticateToken,authorizationAdmin, updateBook);
router.delete('/:id', authenticateToken,authorizationAdmin, deleteBook);

module.exports = router; 