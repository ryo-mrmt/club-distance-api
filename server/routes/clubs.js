const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/', (req, res) => {
  try {
    const clubs = db.prepare('SELECT * FROM clubs ORDER BY id').all();
    res.json(clubs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'クラブ一覧の取得に失敗しました' });
  }
});

router.post('/', (req, res) => {
  const { name, loft } = req.body;

  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'nameは必須です' });
  }

  try {
    const result = db
      .prepare('INSERT INTO clubs (name, loft) VALUES (?, ?)')
      .run(name, loft ?? null);
    const newClub = db.prepare('SELECT * FROM clubs WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(newClub);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'クラブの登録に失敗しました' });
  }
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, loft } = req.body;

  try {
    const existing = db.prepare('SELECT * FROM clubs WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: '指定されたクラブが見つかりません' });
    }

    db.prepare('UPDATE clubs SET name = ?, loft = ? WHERE id = ?').run(
      name ?? existing.name,
      loft ?? existing.loft,
      id
    );

    const updated = db.prepare('SELECT * FROM clubs WHERE id = ?').get(id);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'クラブの更新に失敗しました' });
  }
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;

  try {
    const existing = db.prepare('SELECT * FROM clubs WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: '指定されたクラブが見つかりません' });
    }

    db.prepare('DELETE FROM clubs WHERE id = ?').run(id);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'クラブの削除に失敗しました' });
  }
});

module.exports = router;