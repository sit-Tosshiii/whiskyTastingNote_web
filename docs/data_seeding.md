# データ共有 / シード手順

動作確認用のサンプルデータは、GitHub 上で管理できるよう `database/seeds` と `apps/web/data` 配下に用意しています。別 PC や新しい環境で共有する場合は、以下の手順で再現できます。

## 1. 事前準備

1. リポジトリをクローンし、`docker compose up --build -d` でコンテナを起動。
2. `.env` を作成して `DATABASE_URL` など必要な環境変数を設定。

## 2. サンプルユーザーとノートの投入

`web` コンテナ内で `npm run seed` を実行すると、動作確認用ユーザーとノート（`distilleries.json` ベース）が自動で登録されます。

```bash
docker compose exec -T web npm run seed
```

- 対象ユーザー: `it.chshi17623.m1@gmail.com`
- 初回作成時のログインパスワード: `password`（既に存在する場合は既存パスワードを維持）
- 登録されるノート: `apps/web/data/distilleries.json` を元に変換した全データ

同じ内容が既に登録済みの場合はスキップされ、重複は作られません。

## 3. JSON からの一括登録

大量データを個別に挿入したい場合や、別ユーザーに割り当てたい場合は `apps/web/scripts/import_distilleries.js` を利用してください。環境変数や処理内容を調整し、以下のように実行します。

```bash
docker compose exec -T web node scripts/import_distilleries.js
```

既定では `it.chshi17623.m1@gmail.com` アカウントにノートが大量挿入されます。動作確認後は不要なレコードを削除してください。

## 4. データを GitHub で共有する際の注意

- 実際の会員情報や個人情報は含めず、匿名化したサンプルデータのみコミットする。
- スキーマ変更をしたら、`database/migrations` や `supabase/migrations` のマイグレーションを追加し、必要に応じて seed ファイルも更新する。
- シード用データに変更がある場合は、`docs/README.md` のリンクとこのドキュメントを更新する。

これらの手順を守れば、複数 PC 間でも安全かつ再現性の高い検証環境を共有できます。
