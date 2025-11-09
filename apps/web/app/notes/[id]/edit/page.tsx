"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import type { CSSProperties } from "react";
import { EditNoteForm } from "@/components/EditNoteForm";

export default function EditNotePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const noteId = Number(params?.id);

  if (!Number.isInteger(noteId)) {
    router.push("/notes");
    return null;
  }

  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: "1.5rem", display: "grid", gap: "1.5rem" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>ノートを編集</h1>
          <p style={{ margin: 0, opacity: 0.8 }}>作成済みのテイスティングノートを更新する</p>
        </div>
        <nav style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <Link href="/" style={linkButtonStyle}>
            ホーム
          </Link>
          <Link href="/notes" style={linkButtonStyle}>
            ノート一覧
          </Link>
          <Link href="/notes/new" style={linkButtonStyle}>
            ノートを登録
          </Link>
        </nav>
      </header>

      <section style={{ display: "grid", gap: "1rem" }}>
        <EditNoteForm noteId={noteId} onSaved={() => router.push("/notes")} />
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
