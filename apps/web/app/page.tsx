import { AuthForm } from "@/components/AuthForm";
import { AuthMenu } from "@/components/AuthMenu";
import { getSession } from "@/lib/session";
import Link from "next/link";
import type { CSSProperties } from "react";

const requirements = [
  "ログインして自分だけのノートを管理",
  "香り・味・余韻・評価スコアを記録",
  "キーワード検索でノートを素早く発見",
  "PWAでスマホから快適アクセス"
];

export default async function HomePage() {
  const session = getSession();

  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: "1.5rem", display: "grid", gap: "1.5rem" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>Whisky Tasting Note</h1>
          <p style={{ margin: 0, opacity: 0.8 }}>個人用テイスティングノートと分析基盤のPWA</p>
        </div>
        {session && <AuthMenu email={session.email} />}
      </header>
      {session && (
        <nav style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <Link
            href="/notes/new"
            style={linkButtonStyle}
          >
            ノートを登録
          </Link>
          <Link
            href="/notes"
            style={linkButtonStyle}
          >
            ノートを検索・閲覧
          </Link>
        </nav>
      )}

      {!session ? (
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
            <h2 style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>主な機能予定</h2>
            <ul style={{ paddingLeft: "1.25rem", margin: 0 }}>
              {requirements.map((item) => (
                <li key={item} style={{ marginBottom: "0.5rem" }}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <AuthForm />
        </section>
      ) : (
        <section
          style={{
            padding: "1.5rem",
            borderRadius: "0.75rem",
            border: "1px solid rgba(148, 163, 184, 0.2)",
            backgroundColor: "rgba(15, 23, 42, 0.4)",
            display: "grid",
            gap: "1.25rem"
          }}
        >
          <div style={{ display: "grid", gap: "0.75rem" }}>
            <div>
              <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>ようこそ！</h2>
              <p style={{ margin: 0, opacity: 0.85 }}>
                テイスティングノートの登録と閲覧・検索が別ページになりました。上のボタンから目的のページに移動してください。
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: "1.125rem", marginBottom: "0.35rem" }}>次のアクション</h3>
              <ul style={{ paddingLeft: "1.25rem", margin: 0, display: "grid", gap: "0.35rem" }}>
                <li>「ノートを登録」から蒸留所名や樽情報を含めて記録</li>
                <li>「ノートを検索・閲覧」でキーワード検索や過去の記録を確認</li>
              </ul>
            </div>
          </div>
        </section>
      )}
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
