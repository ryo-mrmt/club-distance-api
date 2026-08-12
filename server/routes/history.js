const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/', (req, res) => {
  try {
    const history = db
        .prepare(`
            SELECT history.id, history.club_id, history.distance, history.date, clubs.name AS club_name
            FROM history
            JOIN clubs ON history.club_id = clubs.id
            ORDER BY history.date ASC, history.id ASC
        `)
        .all();
    res.json(history);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '履歴一覧の取得に失敗しました' });
  }
});

router.post('/', (req, res) => {
  const { clubId, distance, date } = req.body;

  if (!clubId || distance == null || !date) {
    return res.status(400).json({ error: 'clubId, distance, dateは必須です' });
  }

  const club = db.prepare('SELECT * FROM clubs WHERE id = ?').get(clubId);
  if (!club) {
    return res.status(400).json({ error: '指定されたclubIdのクラブが存在しません' });
  }

  try {
    const result = db
      .prepare('INSERT INTO history (club_id, distance, date) VALUES (?, ?, ?)')
      .run(clubId, distance, date);
    const newEntry = db.prepare('SELECT * FROM history WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(newEntry);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '履歴の登録に失敗しました' });
  }
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;

  try {
    const existing = db.prepare('SELECT * FROM history WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: '指定された履歴が見つかりません' });
    }

    db.prepare('DELETE FROM history WHERE id = ?').run(id);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '履歴の削除に失敗しました' });
  }
});

module.exports = router;