const express = require('express');
const cors = require('cors');    // corsパッケージの読み込み CORS（Cross-Origin Resource Sharing）

const clubsRouter = require('./routes/clubs');
const historyRouter = require('./routes/history');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:5174',
      'https://ryo-mrmt.github.io',
    ],
  })
);
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'club-distance-api is running' });
});

app.use('/api/clubs', clubsRouter);
app.use('/api/history', historyRouter);

// 404ハンドラー
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// 共通エラーハンドラー
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'サーバー内部エラーが発生しました' });
});

app.listen(PORT, () => {
  console.log(`club-distance-api server running on http://localhost:${PORT}`);
});