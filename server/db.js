require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS clubs (
      id   SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      loft REAL
    );

    CREATE TABLE IF NOT EXISTS history (
      id       SERIAL PRIMARY KEY,
      club_id  INTEGER NOT NULL,
      distance REAL NOT NULL,
      date     TEXT NOT NULL,
      FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE
    );
  `);

  const clubNames = [
    "1W", "2W", "3W", "4W", "5W", "6W", "7W", "9W", "11W",
    "2UT", "3UT", "4UT", "5UT", "6UT", "7UT",
    "4I", "5I", "6I", "7I", "8I", "9I",
    "46°", "48°", "50°", "52°", "54°", "56°", "58°", "60°"
  ];

  const { rows } = await pool.query('SELECT COUNT(*) AS count FROM clubs');
  if (Number(rows[0].count) === 0) {
    for (const name of clubNames) {
      await pool.query('INSERT INTO clubs (name, loft) VALUES ($1, $2)', [name, null]);
    }
  }
}

initDb().catch((err) => console.error('DB初期化に失敗しました', err));

module.exports = pool;