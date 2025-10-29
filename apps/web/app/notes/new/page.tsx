import Link from "next/link";
import { redirect } from "next/navigation";
import type { CSSProperties } from "react";
import { AuthMenu } from "@/components/AuthMenu";
import { NoteForm } from "@/components/NoteForm";
import { getSession } from "@/lib/session";

export default async function NewNotePage() {
  const session = getSession();
  if (!session) {
    redirect("/");
  }

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "1.5rem", display: "grid", gap: "1.5rem" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>ノートを登録</h1>
          <p style={{ margin: 0, opacity: 0.8 }}>蒸留所・樽情報を含めてテイスティングノートを記録</p>
        </div>
        <AuthMenu email={session.email} />
      </header>

      <nav style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        <Link href="/" style={linkButtonStyle}>
          ホーム
        </Link>
        <Link href="/notes" style={linkButtonStyle}>
          ノートを検索・閲覧
        </Link>
      </nav>

      <NoteForm />
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
