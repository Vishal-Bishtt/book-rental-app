const pool = require('./db/db');

async function testRentalFlow() {
  try {
    console.log('🧪 Testing rental flow...');
    
    // 1. Check if all tables exist
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'books', 'rentals')
      ORDER BY table_name
    `);
    console.log('✅ Tables found:', tables.rows.map(row => row.table_name));
    
    // 2. Get a sample user and book
    const user = await pool.query('SELECT id, email FROM users LIMIT 1');
    const book = await pool.query('SELECT id, title, is_available FROM books WHERE is_available = true LIMIT 1');
    
    if (user.rows.length === 0) {
      console.log('❌ No users found');
      return;
    }
    
    if (book.rows.length === 0) {
      console.log('❌ No available books found');
      return;
    }
    
    console.log('👤 Test user:', user.rows[0].email);
    console.log('📖 Test book:', book.rows[0].title);
    
    // 3. Test rental creation (simulating your backend)
    const userId = user.rows[0].id;
    const bookId = book.rows[0].id;
    
    console.log('🔄 Testing rental creation...');
    
    // Begin transaction
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
      console.log('✅ Rental created successfully!');
      console.log('📦 Rental ID:', rental.rows[0].id);
      
      // 4. Test rental return
      console.log('🔄 Testing rental return...');
      
      await client.query('BEGIN');
      
      // Get rental info
      const rentalInfo = await client.query('SELECT book_id FROM rentals WHERE id = $1 AND status = $2', [rental.rows[0].id, 'active']);
      if (!rentalInfo.rows[0]) {
        throw new Error('Active rental not found');
      }
      
      // Update rental record
      const returnedRental = await client.query(
        'UPDATE rentals SET returned_at = NOW(), status = $1 WHERE id = $2 RETURNING *',
        ['returned', rental.rows[0].id]
      );
      
      // Update book availability
      await client.query('UPDATE books SET is_available = true WHERE id = $1', [rentalInfo.rows[0].book_id]);
      
      await client.query('COMMIT');
      console.log('✅ Book returned successfully!');
      
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
    
    // 5. Show final counts
    const userCount = await pool.query('SELECT COUNT(*) FROM users');
    const bookCount = await pool.query('SELECT COUNT(*) FROM books');
    const rentalCount = await pool.query('SELECT COUNT(*) FROM rentals');
    
    console.log('📊 Final counts:');
    console.log(`   👥 Users: ${userCount.rows[0].count}`);
    console.log(`   📚 Books: ${bookCount.rows[0].count}`);
    console.log(`   📦 Rentals: ${rentalCount.rows[0].count}`);
    
    console.log('\n🎉 All tests passed! Your rental system is ready to use.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await pool.end();
  }
}

// Run the test
testRentalFlow();
