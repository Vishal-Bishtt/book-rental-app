const pool = require('../db/db');

const createRental = async (userId, bookId) => {
  const result = await pool.query(
    'INSERT INTO rentals (user_id, book_id, rented_at, status) VALUES ($1, $2, NOW(), $3) RETURNING *',
    [userId, bookId, 'active']
  );
  return result.rows[0];
};

const returnBook = async (rentalId) => {
  const result = await pool.query(
    'UPDATE rentals SET returned_at = NOW(), status = $1 WHERE id = $2 RETURNING *',
    ['returned', rentalId]
  );
  return result.rows[0];
};

const getAllRentals = async () => {
  const result = await pool.query('SELECT * FROM rentals');
  return result.rows;
};

const getRentalByUserId = async (userId) => {
  const result = await pool.query('SELECT * FROM rentals WHERE user_id = $1', [userId]);
  return result.rows;
};

const deleteRental = async (id) => {
  await pool.query('DELETE FROM rentals WHERE id = $1', [id]);
};

module.exports = {
  createRental,
  returnBook,
  getAllRentals,
  getRentalByUserId,
  deleteRental,
};
 