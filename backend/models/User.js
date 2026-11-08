const { pool } = require("../config/database");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/jwtUtils");

class User {
  // Create a new user
  static async create(userData) {
    const { name, email, password, role = "user" } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = ` INSERT INTO users (name, email, password, role)  VALUES (?, ?, ?, ?) `;
    const [result] = await pool.execute(sql, [
      name,
      email,
      hashedPassword,
      role,
    ]);
    return this.findById(result.insertId);
  }

  // Find user by ID
  static async findById(id) {
    const sql =
      "SELECT id, name, email, role, avatar, is_active, created_at FROM users WHERE id = ?";
    const [rows] = await pool.execute(sql, [id]);
    return rows.length > 0 ? rows[0] : null;
  }

  // Find user by email
  static async findByEmail(email) {
    const sql = "SELECT * FROM users WHERE email = ?";
    const [rows] = await pool.execute(sql, [email]);
    return rows.length > 0 ? rows[0] : null;
  }

  // Find user by email with password (for login)
  static async findByEmailWithPassword(email) {
    const sql = "SELECT * FROM users WHERE email = ?";
    const [rows] = await pool.execute(sql, [email]);
    return rows.length > 0 ? rows[0] : null;
  }

  // Update user profile
  static async update(id, updateData) {
    const { name, email, avatar } = updateData;
    const sql = ` UPDATE users  SET name = ?, email = ?, avatar = ?, updated_at = CURRENT_TIMESTAMP  WHERE id = ? `;
    await pool.execute(sql, [name, email, avatar, id]);
    return this.findById(id);
  }

  // Change password
  static async changePassword(id, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const sql =
      "UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?";
    await pool.execute(sql, [hashedPassword, id]);
    return true;
  }

  // Get all users (for admin)
  static async getAll() {
    const sql =
      "SELECT id, name, email, role, avatar, is_active, created_at FROM users ORDER BY created_at DESC";
    const [rows] = await pool.execute(sql);
    return rows;
  }

  // Check if email exists
  static async emailExists(email, excludeId = null) {
    let sql = "SELECT id FROM users WHERE email = ?";
    let params = [email];
    if (excludeId) {
      sql += " AND id != ?";
      params.push(excludeId);
    }
    const [rows] = await pool.execute(sql, params);
    return rows.length > 0;
  }
  // Verify password
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Generate auth token
  static generateAuthToken(user) {
    return generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });
  }
}

module.exports = User;
