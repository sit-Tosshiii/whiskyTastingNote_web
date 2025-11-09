# Whisky Tasting Note

Whisky テイスティングノートをブラウザ上で管理できる PWA です。データは端末の IndexedDB に保存されるため、ログイン無しでオフラインでも利用できます。Docker や Postgres の設定は、将来の分析機能 / サーバー連携のために引き続き同梱しています。

## セットアップ

```bash
# 依存インストール
cd apps/web
npm install

# 香り・味わい語彙の生成（語彙を更新したい場合のみ）
npm run build:vocabulary

# 開発サーバー起動
npm run dev
```

開発サーバーは `http://localhost:3000` で立ち上がります。ブラウザからアクセスし、ホーム画面に追加すると PWA として利用できます。

## 主な機能

- ノートの登録・検索・編集・削除（IndexedDB に保存）
- 香り／味わい入力をサポートする語彙サジェスト機能
- ブックマークレットによる直近ノートの自動入力 (`docs/bookmarklets.md`)
- PWA 対応（Service Worker / manifest）

## リポジトリ構成

- `apps/web/` – Next.js ベースのフロントエンド
  - `components/` – UI コンポーネント
  - `lib/localNotes.ts` – IndexedDB アクセスユーティリティ
  - `public/manifest.json` / `public/sw.js` – PWA 用設定
  - `scripts/buildFlavorVocabulary.js` – 香り・味わい語彙生成スクリプト
- `database/`, `services/`, `supabase/` – 将来のサーバーサイド機能や Docker 開発環境向け資産（現状の IndexedDB モードでは未使用）
- `docs/` – 要件・バックアップ・ブックマークレットなどの補足資料

## バックアップ

IndexedDB 内のデータはブラウザ開発者ツールから JSON 形式でエクスポートできます。詳しくは `docs/data_seeding.md` を参照してください。

## 注意事項

- ブラウザのストレージはユーザー操作や OS により削除される場合があります。重要なノートはエクスポートしてバックアップしてください。
- 将来的にクラウド同期や分析 API を追加する際は、同梱の Docker/Postgres 環境を流用できます。

