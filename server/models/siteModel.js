const pool = require('../config/db');

class Site {
  static async findAll() {
    const query = 'SELECT * FROM sites ORDER BY name';
    const result = await pool.query(query);
    return result.rows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM sites WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = Site;