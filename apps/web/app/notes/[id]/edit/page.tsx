import Link from "next/link";
import { redirect } from "next/navigation";
import type { CSSProperties } from "react";
import { EditNoteForm } from "@/components/EditNoteForm";
import { AuthMenu } from "@/components/AuthMenu";
import { getSession } from "@/lib/session";
import { query } from "@/lib/db";

type EditPageParams = {
  params: {
    id: string;
  };
};

type NoteRecord = {
  id: number;
  user_id: number;
  whisky_name: string;
  distillery_name: string | null;
  region: string | null;
  abv: string | null;
  cask: string | null;
  aroma: string | null;
  flavor: string | null;
  summary: string | null;
  rating: number | null;
  image_path: string | null;
  created_at: string;
};

async function fetchNote(userId: number, noteId: number) {
  const notes = await query<NoteRecord>(
    `
      select
        id,
        user_id,
        whisky_name,
        distillery_name,
        region,
        abv::text as abv,
        cask,
        aroma,
        flavor,
        summary,
        rating,
        image_path,
        created_at
      from tasting_notes
      where id = $1 and user_id = $2
    `,
    [noteId, userId]
  );
  return notes[0] ?? null;
}

export default async function EditNotePage({ params }: EditPageParams) {
  const session = getSession();
  if (!session) {
    redirect("/");
  }

  const noteId = Number(params.id);
  if (!Number.isInteger(noteId)) {
    redirect("/notes");
  }

  const note = await fetchNote(session.userId, noteId);
  if (!note) {
    redirect("/notes");
  }

  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: "1.5rem", display: "grid", gap: "1.5rem" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>ノートを編集</h1>
          <p style={{ margin: 0, opacity: 0.8 }}>作成済みのテイスティングノートを更新する</p>
        </div>
        <AuthMenu email={session.email} />
      </header>

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

      <section style={{ display: "grid", gap: "1rem" }}>
        <div style={{ fontSize: "0.85rem", opacity: 0.75 }}>
          作成日: {new Date(note.created_at).toLocaleString("ja-JP")}
        </div>
        <EditNoteForm note={note} />
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

