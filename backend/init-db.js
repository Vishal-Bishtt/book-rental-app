const pool = require('./db/db');
const fs = require('fs').promises;
const path = require('path');

async function initializeDatabase() {
  try {
    console.log('🗄️  Initializing database...');
    
    // Read and execute the schema file
    const schemaPath = path.join(__dirname, 'database', 'quick-setup.sql');
    const schema = await fs.readFile(schemaPath, 'utf8');
    
    // Split by semicolon and execute each statement
    const statements = schema.split(';').filter(stmt => stmt.trim().length > 0);
    
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await pool.query(statement);
        } catch (err) {
          // Log warnings but continue (for IF NOT EXISTS statements)
          if (!err.message.includes('already exists')) {
            console.warn('Warning:', err.message);
          }
        }
      }
    }
    
    console.log('✅ Database initialized successfully!');
    
    // Verify tables exist
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'books', 'rentals')
      ORDER BY table_name
    `);
    
    console.log('📋 Tables created:', tables.rows.map(row => row.table_name));
    
    // Check sample data
    const userCount = await pool.query('SELECT COUNT(*) FROM users');
    const bookCount = await pool.query('SELECT COUNT(*) FROM books');
    const rentalCount = await pool.query('SELECT COUNT(*) FROM rentals');
    
    console.log(`👥 Users: ${userCount.rows[0].count}`);
    console.log(`📚 Books: ${bookCount.rows[0].count}`);
    console.log(`📦 Rentals: ${rentalCount.rows[0].count}`);
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    console.error('Full error:', error);
  } finally {
    await pool.end();
  }
}

// Run if called directly
if (require.main === module) {
  initializeDatabase();
}

module.exports = { initializeDatabase };
