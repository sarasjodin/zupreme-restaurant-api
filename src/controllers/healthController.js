import pool from '../config/database.js';

export async function getHealth(req, res) {
  try {
    // Simple database connectivity check.
    // SELECT 1 verifies that MySQL is reachable without depending on any tables
    await pool.query('SELECT 1');

    res.status(200).json({
      status: 'ok',
      service: 'zupreme-restaurant-api',
      database: 'connected',
    });
  } catch (error) {
    console.error('Health check failed:', error.message);

    res.status(503).json({
      status: 'error',
      service: 'zupreme-restaurant-api',
      database: 'disconnected',
    });
  }
}
