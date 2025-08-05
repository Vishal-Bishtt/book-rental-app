const pool = require('./db/db');

async function addCreatedAtColumns() {
  try {
    console.log('Adding created_at columns...');
    
    // Add created_at to books table
    await pool.query(`
      ALTER TABLE books 
      ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    `);
    console.log('✅ Added created_at to books table');
    
    // Add created_at to users table
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    `);
    console.log('✅ Added created_at to users table');
    
    // Update existing records to have created_at values
    await pool.query(`
      UPDATE books SET created_at = CURRENT_TIMESTAMP WHERE created_at IS NULL
    `);
    
    await pool.query(`
      UPDATE users SET created_at = CURRENT_TIMESTAMP WHERE created_at IS NULL
    `);
    
    console.log('✅ Database migration completed successfully!');
    
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
  } finally {
    process.exit();
  }
}

addCreatedAtColumns();
