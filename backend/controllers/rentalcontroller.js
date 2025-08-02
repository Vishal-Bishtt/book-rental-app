const rentalModel = require('../models/rentalModel');

exports.createRental = async (req, res) => {
  const userId = req.user.id;
  const { bookId } = req.body;
  try {
    const rental = await rentalModel.createRental(userId, bookId);
    res.status(201).json(rental);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.returnBook = async (req, res) => {
  const rentalId = req.params.id;
  try {
    const rental = await rentalModel.returnBook(rentalId);
    res.json(rental);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllRentals = async (req, res) => {
  try {
    const rentals = await rentalModel.getAllRentals();
    res.json(rentals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserRentals = async (req, res) => {
  const userId = req.user.id;
  try {
    const rentals = await rentalModel.getRentalByUserId(userId);
    res.json(rentals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteRental = async (req, res) => {
  const id = req.params.id;
  try {
    await rentalModel.deleteRental(id);
    res.json({ message: 'Rental deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
