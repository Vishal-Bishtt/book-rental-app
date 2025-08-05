const pool = require('./db/db');

async function checkSchema() {
  try {
    // Check books table columns
    const booksColumns = await pool.query(
      "SELECT column_name FROM information_schema.columns WHERE table_name = 'books'"
    );
    console.log('Books table columns:', booksColumns.rows.map(r => r.column_name));

    // Check users table columns
    const usersColumns = await pool.query(
      "SELECT column_name FROM information_schema.columns WHERE table_name = 'users'"
    );
    console.log('Users table columns:', usersColumns.rows.map(r => r.column_name));

    // Check rentals table columns
    const rentalsColumns = await pool.query(
      "SELECT column_name FROM information_schema.columns WHERE table_name = 'rentals'"
    );
    console.log('Rentals table columns:', rentalsColumns.rows.map(r => r.column_name));
    
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    process.exit();
  }
}

checkSchema();
