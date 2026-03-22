const { pool, initDb } = require('./src/config/db');

// Database abstraction layer
// Modified to wrap pg queries such that they return exactly the same structural shape
// as better-sqlite3 expected, maintaining total backward compatibility.
const executeQuery = async (query, params = []) => {
  try {
    const result = await pool.query(query, params);

    // Create a hybrid result: an array of rows that also has SQLite-style properties.
    // This maintains compatibility with both:
    // 1. Array access: result[0]
    // 2. Object access: result.lastInsertRowid, result.changes
    const rows = result.rows || [];
    
    // Add SQLite-style metadata to the array object
    rows.changes = result.rowCount;
    rows.lastInsertRowid = (rows.length > 0 && rows[0].id) ? rows[0].id : null;
    rows.__rawPgResult = result;

    return rows;
  } catch (error) {
    throw error;
  }
};

module.exports = { pool, initDb, executeQuery };
