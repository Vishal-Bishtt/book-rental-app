// Test endpoint to check database and user table structure
// Add this to auth.controller.js temporarily for testing

exports.testDatabase = async (req, res) => {
  try {
    // Test connection
    const result = await pool.query('SELECT NOW()');
    console.log('Database connected:', result.rows[0]);

    // Check users table structure
    const tableStructure = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'users'
      ORDER BY ordinal_position;
    `);

    // Check if users table exists and has data
    const userCount = await pool.query('SELECT COUNT(*) FROM users');
    
    res.json({
      connection: 'OK',
      timestamp: result.rows[0].now,
      tableStructure: tableStructure.rows,
      userCount: userCount.rows[0].count
    });
  } catch (err) {
    res.status(500).json({ 
      error: err.message,
      hint: 'Make sure PostgreSQL is running and DATABASE_URL is set correctly'
    });
  }
};
