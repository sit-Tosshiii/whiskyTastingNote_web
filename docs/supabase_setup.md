# データベース設定メモ（ローカル / Supabase 移行）

ローカル開発では Docker Compose 上の Postgres を使用し、`database/init.sql` と追加マイグレーションでスキーマを管理しています。将来的に Supabase へ移行する際のポイントも併記します。

## 1. 必須環境変数
Next.js (`apps/web`) の動作に必要な基本設定。`.env` または `.env.local` に記載し、Docker から読み込ませます。

```
DATABASE_URL=postgresql://postgres:postgres@db:5432/postgres
SESSION_SECRET=十分に長いランダム文字列
SESSION_COOKIE_NAME=whisky_session
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

Supabase 利用時は `DATABASE_URL` を該当プロジェクトの接続文字列に置き換えます。

## 2. ローカル Postgres の初期化とマイグレーション
- `docker compose up` 起動時に `database/init.sql` が実行され、`users` / `tasting_notes` テーブルが生成されます。
- スキーマ追加・制約変更は `database/migrations/*.sql` を用意し、`psql` で順次適用してください（詳細は `docs/docker_setup.md` を参照）。
- 画像パス追加 (`0003_add_note_image.sql`)・カラムリネーム (`0002_update_note_constraints.sql`) など、アプリが期待する最新スキーマを忘れず適用すること。

## 3. ローカル認証の仕組み
- メールアドレス + パスワードで登録/ログイン。ハッシュは `bcrypt` で `users.password_hash` に保存。
- ログイン成功後はサーバー側で JWT を発行し、`SESSION_COOKIE_NAME` のクッキーに格納。`getSession()` で検証して保護ページを制御。

## 4. Supabase 移行時の注意
- `supabase/migrations/` には Supabase 向けの SQL が管理されています。`supabase db push` で適用すると、RLS や `auth.users` 連携を含むテーブルが構築されます。
- 既存のローカルテーブルとはカラム構成が異なるため、移行時は以下を再確認してください。
  - `tasting_notes` の列（`summary`, `image_path`, 文字数制約）が揃っているか。
  - RLS ポリシーを最新状況に合わせて更新しているか。
  - 画像アップロードは Supabase Storage への移行を想定し、ファイルパスの扱いを調整する。
- 認証を Supabase Auth に切り替える場合、Next.js 側の API ルートは Supabase クライアント SDK に置き換える必要があります。

## 5. 動作確認フロー（ローカル）
1. `.env` 準備 → `docker compose up --build -d` でサービス起動。
2. `http://localhost:3001` へアクセスし、新規登録でユーザーを作成。
3. ノートを登録して一覧・検索・編集・削除が動作することを確認。
4. 終了時は `docker compose down`。必要に応じて `docker compose down -v` で `db-data` を初期化。

Supabase で検証する場合は、同様の手順で `DATABASE_URL` を切り替え、Supabase 側にマイグレーションを適用してからアプリを起動します。
