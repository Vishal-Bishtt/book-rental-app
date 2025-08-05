const pool = require('../db/db');

const createRental = async (userId, bookId) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Check if book is available
    const bookCheck = await client.query('SELECT is_available FROM books WHERE id = $1', [bookId]);
    if (!bookCheck.rows[0] || !bookCheck.rows[0].is_available) {
      throw new Error('Book is not available for rental');
    }
    
    // Create rental record
    const rental = await client.query(
      'INSERT INTO rentals (user_id, book_id, rented_at, status) VALUES ($1, $2, NOW(), $3) RETURNING *',
      [userId, bookId, 'active']
    );
    
    // Update book availability
    await client.query('UPDATE books SET is_available = false WHERE id = $1', [bookId]);
    
    await client.query('COMMIT');
    return rental.rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

const returnBook = async (rentalId) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Get rental info
    const rentalInfo = await client.query('SELECT book_id FROM rentals WHERE id = $1 AND status = $2', [rentalId, 'active']);
    if (!rentalInfo.rows[0]) {
      throw new Error('Active rental not found');
    }
    
    // Update rental record
    const rental = await client.query(
      'UPDATE rentals SET returned_at = NOW(), status = $1 WHERE id = $2 RETURNING *',
      ['returned', rentalId]
    );
    
    // Update book availability
    await client.query('UPDATE books SET is_available = true WHERE id = $1', [rentalInfo.rows[0].book_id]);
    
    await client.query('COMMIT');
    return rental.rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

const getAllRentals = async () => {
  const result = await pool.query(`
    SELECT r.*, b.title, b.author, b.genre, u.username 
    FROM rentals r 
    JOIN books b ON r.book_id = b.id 
    JOIN users u ON r.user_id = u.id 
    ORDER BY r.rented_at DESC
  `);
  return result.rows;
};

const getRentalByUserId = async (userId) => {
  const result = await pool.query(`
    SELECT r.*, b.title, b.author, b.genre 
    FROM rentals r 
    JOIN books b ON r.book_id = b.id 
    WHERE r.user_id = $1 AND r.status = 'active'
    ORDER BY r.rented_at DESC
  `, [userId]);
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
 