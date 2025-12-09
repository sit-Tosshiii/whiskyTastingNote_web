"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { CSSProperties } from "react";
import { NoteForm } from "@/components/NoteForm";
import { ShareToX } from "@/components/ShareToX";
import type { NoteRecord } from "@/lib/localNotes";

export default function NewNotePage() {
  const router = useRouter();
  const [savedNote, setSavedNote] = useState<NoteRecord | null>(null);

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "1.5rem", display: "grid", gap: "1.5rem" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>ノートを登録</h1>
          <p style={{ margin: 0, opacity: 0.8 }}>蒸留所・樽情報を含めてテイスティングノートを記録</p>
        </div>
        <nav style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <Link href="/" style={linkButtonStyle}>
            ホーム
          </Link>
          <Link href="/notes" style={linkButtonStyle}>
            ノートを一覧
          </Link>
        </nav>
      </header>

      <NoteForm
        onSaved={(note) => {
          setSavedNote(note);
        }}
      />

      {savedNote && (
        <section style={{ display: "grid", gap: "0.75rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
            <h2 style={{ fontSize: "1.25rem", margin: 0 }}>保存しました。Xでシェアしますか？</h2>
            <Link href="/notes" style={linkButtonStyle}>
              一覧へ戻る
            </Link>
          </div>
          <ShareToX note={savedNote} />
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
