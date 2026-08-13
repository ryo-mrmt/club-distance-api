const express = require('express');
const pool = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT history.id, history.club_id, history.distance, history.date, clubs.name AS club_name
      FROM history
      JOIN clubs ON history.club_id = clubs.id
      ORDER BY history.date ASC, history.id ASC
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '履歴一覧の取得に失敗しました' });
  }
});

router.post('/', async (req, res) => {
  const { clubId, distance, date } = req.body;

  if (!clubId || distance == null || !date) {
    return res.status(400).json({ error: 'clubId, distance, dateは必須です' });
  }

  try {
    const clubResult = await pool.query('SELECT * FROM clubs WHERE id = $1', [clubId]);
    if (clubResult.rows.length === 0) {
      return res.status(400).json({ error: '指定されたclubIdのクラブが存在しません' });
    }

    const { rows } = await pool.query(
      'INSERT INTO history (club_id, distance, date) VALUES ($1, $2, $3) RETURNING *',
      [clubId, distance, date]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '履歴の登録に失敗しました' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { rows } = await pool.query('DELETE FROM history WHERE id = $1 RETURNING *', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: '指定された履歴が見つかりません' });
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '履歴の削除に失敗しました' });
  }
});

module.exports = router;