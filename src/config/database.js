/*
 * Shared MySQL connection pool
 *
 * The pool is created once when the application starts.
 * Other files can import this module instead of creating
 * their own database connections.
 *
 * Environment variables are loaded by Docker Compose
 * from gitignored .env/.env.local and injected into the API container.
 * The application reads them directly from process.env.
 */

import mysql from 'mysql2/promise'; // Project using type: module

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT, // One source of truth from .env file
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true, // Max 10 - others waiting
  connectionLimit: 10,
  charset: 'utf8mb4',
});

export default pool; // Project using type: module
