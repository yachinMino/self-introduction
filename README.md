# Self Introduction Site

React フロントエンドと TypeScript バックエンドで構成した、単一ユーザー運用向けの自己紹介サイトです。

## 構成

- `packages/frontend`: 公開プロフィール画面と編集ログイン / 編集画面
- `packages/backend`: Express API、JWT 認証、SQLite 永続化

## 機能

- 自己紹介の公開表示
- ID / パスワード認証後のみ編集画面に遷移
- 名前、学歴、職務経歴、資格、自己PR の編集
- SQLite による 1 ユーザー分のデータ保存

## セットアップ

```bash
corepack pnpm install
Copy-Item packages/backend/.env.example packages/backend/.env
Copy-Item packages/frontend/.env.example packages/frontend/.env
corepack pnpm dev
```

フロントエンド: `http://localhost:5173`

バックエンド: `http://localhost:3001`

## 初期ログイン情報

- ID: `.env` の `ADMIN_ID`
- パスワード: `.env` の `ADMIN_PASSWORD`

未設定の場合は以下で初期化されます。

- ID: `admin`
- パスワード: `change-this-password`

## API

- `GET /api/profile`: 公開プロフィール取得
- `POST /api/auth/login`: ログイン
- `GET /api/admin/profile`: 編集用プロフィール取得
- `PUT /api/admin/profile`: 編集内容の保存

## Vercel について

Vercel はサーバーレス環境のため、SQLite のようなローカルファイル DB への永続書き込みとは相性が良くありません。今回の実装はローカル開発や通常の Node.js サーバーではそのまま動きますが、Vercel で更新機能まで含めて運用する場合は次のどちらかが必要です。

1. フロントエンドのみ Vercel に配置し、SQLite を使うバックエンドは Render / Railway / Fly.io など別環境に配置する
2. Vercel 上で完結させるなら DB を SQLite ではなく Vercel Postgres などの永続ストアへ変更する

## Vercel 設定例

フロントエンドだけを Vercel に載せる前提です。

- Root Directory: `packages/frontend`
- Build Command: `vite build`
- Output Directory: `dist`
- Environment Variable: `VITE_API_URL=https://<backend-domain>`

バックエンドは別の Node.js 実行環境へ配置し、`packages/backend/.env` で少なくとも以下を設定します。

- `PORT=3001`
- `FRONTEND_ORIGIN=https://<your-vercel-domain>`
- `JWT_SECRET=<strong-random-secret>`
- `ADMIN_ID=<login-id>`
- `ADMIN_PASSWORD=<login-password>`
