const pool = require('../config/db');

class CheckIn {
  static async create(userId, siteId, reasonForVisit) {
    const query = `
      INSERT INTO check_ins (user_id, site_id, check_in_time, reason_for_visit, status)
      VALUES ($1, $2, NOW(), $3, 'active')
      RETURNING *
    `;
    const result = await pool.query(query, [userId, siteId, reasonForVisit]);
    return result.rows[0];
  }

  static async findActiveByUserId(userId) {
    const query = `
      SELECT ci.*, s.name as site_name, s.latitude, s.longitude
      FROM check_ins ci
      JOIN sites s ON ci.site_id = s.id
      WHERE ci.user_id = $1 AND ci.status = 'active'
      ORDER BY ci.check_in_time DESC
      LIMIT 1
    `;
    const result = await pool.query(query, [userId]);
    return result.rows[0];
  }

  static async checkOut(checkInId, feedback) {
    const query = `
      UPDATE check_ins
      SET check_out_time = NOW(),
          feedback_good = $2,
          feedback_bad = $3,
          feedback_suggestions = $4,
          status = 'completed'
      WHERE id = $1
      RETURNING *
    `;
    const result = await pool.query(query, [
      checkInId,
      feedback.good,
      feedback.bad,
      feedback.suggestions
    ]);
    return result.rows[0];
  }

  static async findAllActive() {
    const query = `
      SELECT 
        ci.*,
        u.first_name,
        u.last_name,
        u.email,
        s.name as site_name,
        s.latitude,
        s.longitude,
        EXTRACT(EPOCH FROM (NOW() - ci.check_in_time)) as duration_seconds
      FROM check_ins ci
      JOIN users u ON ci.user_id = u.id
      JOIN sites s ON ci.site_id = s.id
      WHERE ci.status = 'active'
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  static async findAllCompleted() {
    const query = `
      SELECT 
        ci.*,
        u.first_name,
        u.last_name,
        u.email,
        s.name as site_name,
        s.latitude,
        s.longitude
      FROM check_ins ci
      JOIN users u ON ci.user_id = u.id
      JOIN sites s ON ci.site_id = s.id
      WHERE ci.status = 'completed'
      ORDER BY ci.check_out_time DESC
      LIMIT 100
    `;
    const result = await pool.query(query);
    return result.rows;
  }
}

module.exports = CheckIn;