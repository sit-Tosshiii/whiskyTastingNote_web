# データベース設定メモ（ローカル / Supabase 移行）

ローカル開発では Docker Compose 上の Postgres を使用し、`database/init.sql` と追加マイグレーションでスキーマを管理しています。将来的に Supabase へ移行する際のポイントも併記します。

## 1. 必須環境変数
IndexedDB モードでは `.env` は不要です。Postgres / Supabase と連携させたい場合のみ、Next.js (`apps/web`) で以下を設定します。`.env` または `.env.local` に記載し、Docker から読み込ませてください。

```
DATABASE_URL=postgresql://postgres:postgres@db:5432/postgres
SESSION_SECRET=十分に長いランダム文字列
SESSION_COOKIE_NAME=whisky_session
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

Supabase 利用時は `DATABASE_URL` を該当プロジェクトの接続文字列に置き換えます。IndexedDB モードのまま開発する場合はこれらの変数を設定する必要はありません。

## 2. ローカル Postgres の初期化とマイグレーション
- `docker compose up` 起動時に `database/init.sql` が実行され、`users` / `tasting_notes` テーブルが生成されます。
- スキーマ追加・制約変更は `database/migrations/*.sql` を用意し、`psql` で順次適用してください（詳細は `docs/docker_setup.md` を参照）。
- 画像パス追加 (`0003_add_note_image.sql`)・カラムリネーム (`0002_update_note_constraints.sql`) など、アプリが期待する最新スキーマを忘れず適用すること。

## 3. 認証について
- 現在の PWA ではログイン機能を提供していません。データは端末ごとの IndexedDB のみに保存されます。
- サーバーサイド認証を再導入する場合は `users` テーブルと JWT Cookie を利用する実装（`apps/web/lib/db.ts` など）をベースに復元できます。

## 4. Supabase 移行時の注意
- `supabase/migrations/` には Supabase 向けの SQL が管理されています。`supabase db push` で適用すると、RLS や `auth.users` 連携を含むテーブルが構築されます。
- 既存のローカルテーブルとはカラム構成が異なるため、移行時は以下を再確認してください。
  - `tasting_notes` の列（`summary`, `image_path`, 文字数制約）が揃っているか。
  - RLS ポリシーを最新状況に合わせて更新しているか。
  - 画像アップロードは Supabase Storage への移行を想定し、ファイルパスの扱いを調整する。
- 認証を Supabase Auth に切り替える場合、Next.js 側の API ルートは Supabase クライアント SDK に置き換える必要があります。

## 5. 動作確認フロー（ローカル）
1. `.env` を用意し（サーバーモード時のみ）→ `docker compose up --build -d` でサービス起動。
2. IndexedDB モードのまま利用する場合は `http://localhost:3000` で `npm run dev` を起動すれば十分です。
3. サーバーモードで検証する場合は、ユーザー登録用の API を復元し、ノート登録・検索・編集・削除が動くことを確認してください。
4. 終了時は `docker compose down`。必要に応じて `docker compose down -v` で `db-data` を初期化します。

Supabase で検証する場合は、同様の手順で `DATABASE_URL` を切り替え、Supabase 側にマイグレーションを適用してからアプリを起動します。
