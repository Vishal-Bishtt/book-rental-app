const pool = require('../db/db');

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Admins only' });
    }

    // Get total counts
    const userCount = await pool.query('SELECT COUNT(*) FROM users');
    const bookCount = await pool.query('SELECT COUNT(*) FROM books');
    const activeRentals = await pool.query('SELECT COUNT(*) FROM rentals WHERE status = $1', ['active']);
    const totalRentals = await pool.query('SELECT COUNT(*) FROM rentals');

    // Get all rentals with user and book details
    const rentalsWithDetails = await pool.query(`
      SELECT 
        r.id,
        r.rented_at,
        r.returned_at,
        r.status,
        u.name as user_name,
        u.email as user_email,
        b.title as book_title,
        b.author as book_author,
        b.genre as book_genre
      FROM rentals r
      JOIN users u ON r.user_id = u.id
      JOIN books b ON r.book_id = b.id
      ORDER BY r.rented_at DESC
    `);

    res.json({
      stats: {
        totalUsers: parseInt(userCount.rows[0].count),
        totalBooks: parseInt(bookCount.rows[0].count),
        activeRentals: parseInt(activeRentals.rows[0].count),
        totalRentals: parseInt(totalRentals.rows[0].count)
      },
      rentals: rentalsWithDetails.rows
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

    const users = await pool.query('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC');
    res.json(users.rows);
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

    const books = await pool.query('SELECT * FROM books ORDER BY created_at DESC');
    res.json(books.rows);
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

    const result = await pool.query(
      'INSERT INTO books (title, author, genre, is_available) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, author, genre, is_available]
    );

    res.status(201).json(result.rows[0]);
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

    const fields = [];
    const values = [];
    let paramCount = 1;

    if (title !== undefined) {
      fields.push(`title = $${paramCount++}`);
      values.push(title);
    }
    if (author !== undefined) {
      fields.push(`author = $${paramCount++}`);
      values.push(author);
    }
    if (genre !== undefined) {
      fields.push(`genre = $${paramCount++}`);
      values.push(genre);
    }
    if (is_available !== undefined) {
      fields.push(`is_available = $${paramCount++}`);
      values.push(is_available);
    }

    if (fields.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    values.push(id);
    const result = await pool.query(
      `UPDATE books SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json(result.rows[0]);
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
    const activeRental = await pool.query('SELECT id FROM rentals WHERE book_id = $1 AND status = $2', [id, 'active']);
    if (activeRental.rows.length > 0) {
      return res.status(400).json({ message: 'Cannot delete book that is currently rented' });
    }

    const result = await pool.query('DELETE FROM books WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json({ message: 'Book deleted successfully', book: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
