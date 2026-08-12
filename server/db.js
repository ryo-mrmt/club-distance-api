const path = require('path');
const Database = require('better-sqlite3');
const dbPath = path.join(__dirname, 'data', 'club-distance.db');
const db = new Database(dbPath);
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS clubs (
    id   INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    loft REAL
  );

  CREATE TABLE IF NOT EXISTS history (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
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

const clubCount = db.prepare('SELECT COUNT(*) AS count FROM clubs').get().count;
if (clubCount === 0) {
  const insertClub = db.prepare('INSERT INTO clubs (name, loft) VALUES (?, ?)');
  clubNames.forEach((name) => insertClub.run(name, null));
}

module.exports = db;