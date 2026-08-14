# club-distance-api

golf club distance app（[club-distance-app](https://github.com/ryo-mrmt/club-distance-app)）のバックエンドAPI。
React/Viteフロントエンドの localStorage 管理を、Node.js + Express + PostgreSQL によるAPIサーバーに置き換えたもの。

**本番環境**: https://club-distance-api.onrender.com

## 技術スタック

- Node.js / Express
- PostgreSQL（[Neon](https://neon.tech)、サーバーレスホスティング）
- pg（PostgreSQL用ドライバ）
- cors
- dotenv

デプロイ: [Render](https://render.com)（無料プラン）

## セットアップ

```bash
npm install
```

`.env`ファイルを作成し、PostgreSQLの接続文字列を設定してください。

```
DATABASE_URL=postgresql://ユーザー名:パスワード@ホスト名/データベース名?sslmode=require
```

```bash
npm run dev # nodemon（ファイル変更で自動再起動）
npm run start # 本番起動
```

デフォルトでは `http://localhost:3001` で起動します。初回起動時、`clubs`テーブルが空であれば29種類のクラブ名が自動でシードされます。

## APIエンドポイント

### クラブ

| メソッド | パス             | 説明           |
| -------- | ---------------- | -------------- |
| GET      | `/api/clubs`     | クラブ一覧取得 |
| POST     | `/api/clubs`     | クラブ新規登録 |
| PUT      | `/api/clubs/:id` | クラブ情報更新 |
| DELETE   | `/api/clubs/:id` | クラブ削除     |

### 飛距離履歴

| メソッド | パス               | 説明                                   |
| -------- | ------------------ | -------------------------------------- |
| GET      | `/api/history`     | 履歴一覧取得（クラブ名付き、日付昇順） |
| POST     | `/api/history`     | 履歴新規登録                           |
| DELETE   | `/api/history/:id` | 履歴削除                               |

## データ構造

`clubs`と`history`は外部キー（`history.club_id` → `clubs.id`）で紐づいており、クラブを削除すると紐づく履歴も自動的に削除されます（`ON DELETE CASCADE`）。

## エラーハンドリング

- 存在しないIDへの PUT/DELETE → `404`
- 必須項目の欠如、または存在しない`clubId`での履歴登録 → `400`
- その他のサーバー内部エラー → `500`

## CORS

開発環境（`http://localhost:5173`）と、GitHub Pagesでホストされているフロントエンド本番URLからのアクセスを許可しています。
