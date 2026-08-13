const express = require('express');
const pool = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM clubs ORDER BY id');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'クラブ一覧の取得に失敗しました' });
  }
});

router.post('/', async (req, res) => {
  const { name, loft } = req.body;

  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'nameは必須です' });
  }

  try {
    const { rows } = await pool.query(
      'INSERT INTO clubs (name, loft) VALUES ($1, $2) RETURNING *',
      [name, loft ?? null]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'クラブの登録に失敗しました' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, loft } = req.body;

  try {
    const existingResult = await pool.query('SELECT * FROM clubs WHERE id = $1', [id]);
    const existing = existingResult.rows[0];
    if (!existing) {
      return res.status(404).json({ error: '指定されたクラブが見つかりません' });
    }

    const { rows } = await pool.query(
      'UPDATE clubs SET name = $1, loft = $2 WHERE id = $3 RETURNING *',
      [name ?? existing.name, loft ?? existing.loft, id]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'クラブの更新に失敗しました' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { rows } = await pool.query('DELETE FROM clubs WHERE id = $1 RETURNING *', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: '指定されたクラブが見つかりません' });
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'クラブの削除に失敗しました' });
  }
});

module.exports = router;