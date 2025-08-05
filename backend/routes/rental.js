const express = require('express');
const router = express.Router();
const rentalController = require('../controllers/rentalcontroller');
const authenticateToken = require('./auth/auth.middleware');
const authorizeAdmin = require('./auth/authorizeAdmin');

router.post('/', authenticateToken, rentalController.createRental);
router.put('/:id/return', authenticateToken, rentalController.returnBook);
router.get('/me', authenticateToken, rentalController.getUserRentals);
router.get('/', authenticateToken, authorizeAdmin, rentalController.getAllRentals);
router.delete('/:id', authenticateToken, authorizeAdmin, rentalController.deleteRental);

module.exports = router;
