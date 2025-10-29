# Docker 開発環境メモ

## 1. 構成イメージとサービス一覧

```
+----------------------+        +--------------------+
|  web (Next.js dev)   | <----> |  db (Postgres 15)  |
|  node:20-alpine      |        |  port 5432         |
|  http://localhost:3001        |                    |
+----------+-----------+        +---------+----------+
           |                                   ^
           v                                   |
+----------------------+            +------------------------+
| analytics-api        |  HTTP ---> | SQL / future analysis  |
| (FastAPI dev)        |            | via PostgreSQL         |
| http://localhost:8000|            |                        |
+----------------------+            +------------------------+
```

- **web**: Next.js (App Router)。ローカル専用のメール/パスワード認証とノート管理UIを提供。
- **db**: 公式 `postgres:15` イメージ。初期化時に `database/init.sql` を読み込んで `users` / `tasting_notes` テーブルを作成。
- **analytics-api**: Python + FastAPI のスタブ。今後の Word2Vec / PCA / k-NN などの分析機能を差し込む予定。

## 2. 環境変数・ボリューム設計（最小構成）

### web サービス
- `DATABASE_URL`: Next.js から Postgres に接続するための DSN。例 `postgresql://postgres:postgres@db:5432/postgres`。
- `SESSION_SECRET` / `SESSION_COOKIE_NAME`: JWT セッション用のシークレットとクッキー名。
- `NEXT_PUBLIC_API_BASE_URL`: 分析APIとの連携用ベースURL（現状は `http://localhost:8000`）。
- ボリューム
  - `./apps/web:/app`: フロントエンドのソースコード同期。
  - `web-node-modules`: 依存パッケージキャッシュ。

### analytics-api サービス
- `DATABASE_URL`: 分析APIがDBへアクセスする際の接続文字列。
- ボリューム
  - `./services/analytics:/app`: Pythonコードの同期。
  - `analytics-venv`: pip キャッシュ。

### db サービス
- `POSTGRES_USER` / `POSTGRES_PASSWORD` / `POSTGRES_DB`: Postgres の基本設定。
- ボリューム
  - `db-data`: 永続化用データ領域。
  - `./database/init.sql` を `docker-entrypoint-initdb.d` にマウントして初期テーブルを作成。
  - 追加マイグレーションは `database/migrations/*.sql` を手動適用する。

### 共通運用メモ
- `.env` に各種変数を定義し、`docker compose` 起動時に読み込ませる。
- 初期パスワードなどの秘匿情報は Git 管理しない。
- 将来的に本番展開する際は Vercel/Render などへのデプロイ方法と Secrets 管理を検討。

## 3. 起動手順とテストログ

1. `docker compose up --build -d` でサービスを起動。初回はイメージ/依存のダウンロードで時間がかかる。
2. 確認コマンド例:
- `docker compose ps` で `web` / `analytics-api` / `db` が Up 状態であること。
- `docker compose logs web --tail 20` で Next.js dev サーバーの起動ログを確認。
   - `docker compose logs analytics-api --tail 20` で Uvicorn が待ち受けていることを確認。
3. 終了時は `docker compose down` を実行してコンテナとネットワークを破棄。

### 検証時のメモ
- Postgres 初期化は `database/init.sql` に依存。スキーマ変更時はマイグレーション管理（例：Sqitch、Prisma Migrate）を導入予定。
- Next.js コンテナは起動時に `npm install` を実行する。パフォーマンス改善のため `package-lock.json` をコミットし `npm ci` に切り替える案を検討中。
- ローカル認証は JWT Cookie ベース。`SESSION_SECRET` を十分長いランダム文字列に変更して利用する。

## 4. マイグレーション適用の流れ

DB コンテナには初期化 SQL のみ自動適用されるため、スキーマ追加やサンプルデータ投入は手動で実行する。

### サンプルデータの投入

`docker compose exec -T web npm run seed`

- ユーザー: `it.chshi17623.m1@gmail.com` （初回作成時のみパスワード `password` を設定）
- ノート: `apps/web/data/distilleries.json` を元に変換した全データを追加（重複はスキップ）

より大きなデータが必要な場合は `node scripts/import_distilleries.js` を利用する。

### マイグレーション適用例

- 例：画像カラム追加マイグレーション  
  `docker compose exec -T db psql -U postgres -d postgres -f /app/database/migrations/0003_add_note_image.sql`
- 例：制約・列リネームマイグレーション  
  `cat database/migrations/0002_update_note_constraints.sql | docker compose exec -T db psql -U postgres -d postgres`

適用後は `docker compose restart web` で Next.js を再起動し、最新スキーマに追随させる。
