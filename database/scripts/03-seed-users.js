import bcrypt from 'bcrypt';
import pool from '../../src/config/database.js';

const users = [
  {
    name: 'Hanna Zupreme',
    email: 'admin@zupreme.se',
    password: process.env.ADMIN_PASSWORD,
    role: 'admin',
  },
  {
    name: 'Anna Zupreme',
    email: 'editor@zupreme.se',
    password: process.env.EDITOR_PASSWORD,
    role: 'editor',
  },
];

async function seedUsers() {
  try {
    for (const user of users) {
      if (!user.password) {
        throw new Error(`Missing password for ${user.email}.`);
      }

      const passwordHash = await bcrypt.hash(user.password, 10);

      await pool.query(
        `INSERT INTO users (
          name,
          email,
          password_hash,
          role,
          is_active
        )
        VALUES (?, ?, ?, ?, TRUE)
        ON DUPLICATE KEY UPDATE
          name = VALUES(name),
          password_hash = VALUES(password_hash),
          role = VALUES(role),
          is_active = TRUE`,
        [user.name, user.email, passwordHash, user.role],
      );

      console.log(`User seeded: ${user.email} (${user.role})`);
    }

    console.log('User seed completed.');
  } catch (error) {
    console.error('Could not seed users.');
    console.error(error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

seedUsers();
