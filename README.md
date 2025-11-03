# Whisky Tasting Note

Whisky テイスティングノートを管理・検索できる PWA 対応の Web アプリです。Next.js (App Router) と Postgres を使用し、Docker Compose でローカル開発環境を立ち上げられる構成になっています。

## ローカル開発

```bash
# 依存インストール（ホスト側）
npm install --prefix apps/web

# Docker コンテナ起動
docker compose up --build -d

# Next.js Dev サーバー: http://localhost:3001
# FastAPI スタブ:       http://localhost:8000

# 停止
docker compose down

# 語彙データの生成（必要に応じて）
npm run --prefix apps/web build:vocabulary
```

詳細なセットアップやマイグレーション適用手順は `docs/` 以下を参照してください。

## サンプルデータ投入

```bash
docker compose exec -T web npm run seed
```

- 対象ユーザー: `it.chshi17623.m1@gmail.com`
- パスワード: シード実行時に存在しなければ `password`
- データソース: `apps/web/data/distilleries.json`

より詳しいデータ共有手順は `docs/data_seeding.md` にまとめています。

## リポジトリ構成

- `apps/web/` – Next.js フロントエンド
- `services/analytics/` – 将来の嗜好分析 API（FastAPI）
- `database/` – Postgres 初期化 SQL と追加マイグレーション
- `supabase/` – Supabase 移行用のスキーマ定義
- `docs/` – セットアップ・要件・データ共有に関するドキュメント

## 注意事項

- `apps/web/node_modules` や `.next` などの生成物は Git 管理外です。必要に応じて `npm install` を再実行してください。
- 実運用データはコミットせず、提供されているシードスクリプトや dump を利用して動作確認を行ってください。
