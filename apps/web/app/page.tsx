import Link from "next/link";
import type { CSSProperties } from "react";

const features = [
  "香り・味わい・総合メモを手軽に記録",
  "キーワード検索で過去のノートをすばやく発見",
  "IndexedDB に保存するのでオフラインでも利用可能",
  "PWA としてホーム画面に追加してワンタップ起動"
];

export default function HomePage() {
  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: "1.5rem", display: "grid", gap: "1.5rem" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>Whisky Tasting Note</h1>
          <p style={{ margin: 0, opacity: 0.8 }}>オフライン対応のテイスティングノートアプリ</p>
        </div>
        <nav style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <Link href="/notes/new" style={linkButtonStyle}>
            ノートを登録
          </Link>
          <Link href="/notes" style={linkButtonStyle}>
            ノート一覧
          </Link>
        </nav>
      </header>

      <section
        style={{
          padding: "1.5rem",
          borderRadius: "0.75rem",
          border: "1px solid rgba(148, 163, 184, 0.2)",
          backgroundColor: "rgba(15, 23, 42, 0.4)",
          display: "grid",
          gap: "1rem"
        }}
      >
        <div>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>主な特徴</h2>
          <ul style={{ paddingLeft: "1.25rem", margin: 0 }}>
            {features.map((item) => (
              <li key={item} style={{ marginBottom: "0.5rem" }}>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 style={{ fontSize: "1.125rem", marginBottom: "0.35rem" }}>はじめ方</h3>
          <ol style={{ paddingLeft: "1.25rem", margin: 0, display: "grid", gap: "0.35rem" }}>
            <li>「ノートを登録」ページで香り・味わいを入力</li>
            <li>一覧ページで検索・編集・削除が可能</li>
            <li>PWA をホーム画面に追加していつでもアクセス</li>
          </ol>
        </div>
      </section>
    </main>
  );
}

const linkButtonStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0.6rem 1.1rem",
  borderRadius: "9999px",
  border: "1px solid rgba(148, 163, 184, 0.35)",
  backgroundColor: "rgba(15, 23, 42, 0.5)",
  color: "#f8fafc",
  fontSize: "0.85rem",
  fontWeight: 600,
  textDecoration: "none"
};

