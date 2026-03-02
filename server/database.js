const { pool, initDb } = require('./src/config/db');

// Database abstraction layer
// Modified to wrap pg queries such that they return exactly the same structural shape
// as better-sqlite3 expected, maintaining total backward compatibility.
const executeQuery = async (query, params = []) => {
  try {
    const result = await pool.query(query, params);

    // SQLite's stmt.all() returns an array of rows
    if (query.trim().toUpperCase().startsWith('SELECT')) {
      return result.rows;
    }

    // SQLite's stmt.run() returned an object with properties
    // like `lastInsertRowid` and `changes`. We mock that here.
    return {
      changes: result.rowCount,
      // If we used a RETURNING id clause, simulate lastInsertRowid
      lastInsertRowid: result.rows.length > 0 && result.rows[0].id ? result.rows[0].id : null,
      __rawPgResult: result // Keep raw result around just in case
    };
  } catch (error) {
    throw error;
  }
};

module.exports = { pool, initDb, executeQuery };
