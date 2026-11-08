const mysql = require("mysql2/promise");
require("dotenv").config();

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "auth_system",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ MySQL Database connected successfully");
    connection.release();
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
};

// Initialize database and tables
const initDatabase = async () => {
  try {
    // Create database if not exists
    const tempPool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });
    await tempPool.execute(
      `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``,
    );
    console.log("✅ Database created/verified");
    await tempPool.end();
    // Create users table
    const createUsersTable = ` CREATE TABLE IF NOT EXISTS users ( id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(100) NOT NULL, email VARCHAR(255) UNIQUE NOT NULL, password VARCHAR(255) NOT NULL,role ENUM('user', 'admin') DEFAULT 'user', avatar VARCHAR(500) DEFAULT '', is_active BOOLEAN DEFAULT TRUE, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP ) `;
    await pool.execute(createUsersTable);
    console.log("✅ Users table created/verified");
    // Insert sample admin user if not exists
    const bcrypt = require("bcryptjs");
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const insertAdmin = ` INSERT IGNORE INTO users (name, email, password, role)  VALUES (?, ?, ?, ?) `;
    await pool.execute(insertAdmin, [
      "Admin User",
      "admin@example.com",
      hashedPassword,
      "admin",
    ]);
    console.log("✅ Sample admin user created");

    // Insert sample regular user if not exists
    const hashedUserPassword = await bcrypt.hash("user123", 10);
    const insertUser = ` INSERT IGNORE INTO users (name, email, password, role)  VALUES (?, ?, ?, ?) `;
    await pool.execute(insertUser, [
      "Regular User",
      "user@example.com",
      hashedUserPassword,
      "user",
    ]);
    console.log("✅ Sample regular user created");
  } catch (error) {
    console.error("❌ Database initialization failed:", error.message);
  }
};

module.exports = {
  pool,
  testConnection,
  initDatabase,
};
