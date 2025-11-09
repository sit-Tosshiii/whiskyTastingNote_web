export default function DocsPage() {
  return (
    <main style={{ maxWidth: 560, padding: "1.5rem", lineHeight: 1.7 }}>
      <h1 style={{ fontSize: "1.75rem", marginBottom: "1rem" }}>開発メモ</h1>
      <p>
        現在のアプリはブラウザの IndexedDB にすべてのテイスティングノートを保存し、Service Worker
        を用いた PWA としてオフラインでも動作します。ログインやサーバー連携は行わず、端末内に閉じた形で
        編集・検索・削除まで完結します。
      </p>
      <p>
        将来の広告表示やデータ分析機能に備えて、Docker Compose で Next.js / PostgreSQL /
        FastAPI をまとめて起動できる環境は引き続きリポジトリに同梱しています。サーバー側の処理を検証したい場面では
        `docs/docker_setup.md` を参照し、必要なサービスだけを有効化してください。
      </p>
      <p>IndexedDB のバックアップ・共有手順は `docs/data_seeding.md` にまとめています。</p>
    </main>
  );
}
