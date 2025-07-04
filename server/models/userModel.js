const pool = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
  static async create(userData) {
    const { firstName, lastName, email, password, googleId } = userData;
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
    
    const query = `
      INSERT INTO users (first_name, last_name, email, password, google_id, is_verified)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, first_name, last_name, email, is_verified
    `;
    
    const values = [
      firstName,
      lastName,
      email,
      hashedPassword,
      googleId || null,
      googleId ? true : false
    ];
    
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async updateVerificationToken(email, token) {
    const query = 'UPDATE users SET verification_token = $1 WHERE email = $2';
    await pool.query(query, [token, email]);
  }

  static async verifyUser(token) {
    const query = `
      UPDATE users 
      SET is_verified = true, verification_token = null 
      WHERE verification_token = $1
      RETURNING id, email
    `;
    const result = await pool.query(query, [token]);
    return result.rows[0];
  }

  static async updateResetToken(email, token) {
    const expiry = new Date(Date.now() + 3600000); // 1 hour
    const query = `
      UPDATE users 
      SET reset_token = $1, reset_token_expiry = $2 
      WHERE email = $3
    `;
    await pool.query(query, [token, expiry, email]);
  }

  static async findByResetToken(token) {
    const query = `
      SELECT * FROM users 
      WHERE reset_token = $1 AND reset_token_expiry > NOW()
    `;
    const result = await pool.query(query, [token]);
    return result.rows[0];
  }

  static async updatePassword(userId, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const query = `
      UPDATE users 
      SET password = $1, reset_token = null, reset_token_expiry = null 
      WHERE id = $2
    `;
    await pool.query(query, [hashedPassword, userId]);
  }

  static async findOrCreateGoogleUser(profile) {
    const { id, emails, name } = profile;
    const email = emails[0].value;
    
    let user = await this.findByEmail(email);
    
    if (!user) {
      user = await this.create({
        firstName: name.givenName,
        lastName: name.familyName,
        email: email,
        googleId: id
      });
    }
    
    return user;
  }

  static async updateRole(userId, role) {
    const query = 'UPDATE users SET role = $1 WHERE id = $2 RETURNING *';
    const result = await pool.query(query, [role, userId]);
    return result.rows[0];
  }
}

module.exports = User;