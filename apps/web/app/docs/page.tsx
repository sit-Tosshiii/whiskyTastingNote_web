export default function DocsPage() {
  return (
    <main style={{ maxWidth: 560, padding: "1.5rem" }}>
      <h1 style={{ fontSize: "1.75rem", marginBottom: "1rem" }}>開発メモ</h1>
      <p style={{ lineHeight: 1.6 }}>
        Docker コンテナ上で Next.js フロントエンドと PostgreSQL、Python 製の分析 API
        をまとめて動かす構成です。まずはローカルだけで完結するログイン・ノート管理を実装し、
        その後に外部サービス連携や高度な分析機能を追加していく方針です。詳細は
        `docs/docker_setup.md` を参照してください。
      </p>
    </main>
  );
}
