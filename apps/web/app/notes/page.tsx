"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { CSSProperties, FormEvent } from "react";
import { NotesList } from "@/components/NotesList";
import { getAllNotes, deleteNote, type NoteRecord } from "@/lib/localNotes";

function filterNotes(notes: NoteRecord[], keyword: string) {
  if (!keyword) return notes;
  const lower = keyword.toLowerCase();
  return notes.filter((note) =>
    [
      note.whisky_name,
      note.distillery_name ?? "",
      note.region ?? "",
      note.cask ?? "",
      note.aroma ?? "",
      note.flavor ?? "",
      note.summary ?? "",
      note.abv?.toString() ?? "",
      note.rating?.toString() ?? ""
    ].some((value) => value.toLowerCase().includes(lower))
  );
}

export default function NotesPage() {
  const router = useRouter();
  const params = useSearchParams();
  const keywordParam = params.get("q") ?? "";
  const [keyword, setKeyword] = useState(keywordParam);
  const [notes, setNotes] = useState<NoteRecord[]>([]);

  const loadNotes = useCallback(async () => {
    const all = await getAllNotes();
    setNotes(all);
  }, []);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  useEffect(() => {
    setKeyword(keywordParam);
  }, [keywordParam]);

  const filteredNotes = useMemo(() => filterNotes(notes, keyword), [notes, keyword]);

  const handleSearch = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const value = String(formData.get("q") ?? "").trim();
      router.replace(value ? `/notes?q=${encodeURIComponent(value)}` : "/notes");
    },
    [router]
  );

  const handleResetSearch = useCallback(() => {
    router.replace("/notes");
  }, [router]);

  const handleDelete = useCallback(
    async (noteId: number) => {
      if (!window.confirm("ノートを削除しますか？")) {
        return;
      }
      await deleteNote(noteId);
      loadNotes();
    },
    [loadNotes]
  );

  const handleEdit = useCallback(
    (noteId: number) => {
      router.push(`/notes/${noteId}/edit`);
    },
    [router]
  );

  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: "1.5rem", display: "grid", gap: "1.5rem" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>ノートを検索・閲覧</h1>
          <p style={{ margin: 0, opacity: 0.8 }}>キーワードでフィルタリングして記録を探す</p>
        </div>
        <nav style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <Link href="/" style={linkButtonStyle}>
            ホーム
          </Link>
          <Link href="/notes/new" style={linkButtonStyle}>
            ノートを登録
          </Link>
        </nav>
      </header>

      <form onSubmit={handleSearch} style={searchFormStyle}>
        <div style={{ flex: "1 1 auto", display: "grid", gap: "0.35rem" }}>
          <label htmlFor="note-search" style={{ fontSize: "0.75rem", opacity: 0.7 }}>
            キーワード検索
          </label>
          <input
            id="note-search"
            name="q"
            defaultValue={keyword}
            placeholder="銘柄名 / 蒸留所 / 産地 / 樽 / テイスティングメモ"
            style={{
              padding: "0.6rem 0.8rem",
              borderRadius: "0.5rem",
              border: "1px solid rgba(148, 163, 184, 0.4)",
              backgroundColor: "rgba(15, 23, 42, 0.4)",
              color: "#f8fafc"
            }}
          />
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: "0.5rem" }}>
          <button
            type="submit"
            style={{
              padding: "0.6rem 1.1rem",
              borderRadius: "0.5rem",
              border: "1px solid rgba(148, 163, 184, 0.35)",
              backgroundColor: "#0f172a",
              color: "#f8fafc",
              fontWeight: 600
            }}
          >
            検索
          </button>
          {keyword && (
            <button
              type="button"
              onClick={handleResetSearch}
              style={{
                padding: "0.6rem 1rem",
                borderRadius: "0.5rem",
                border: "1px solid rgba(148, 163, 184, 0.2)",
                color: "#f8fafc",
                fontWeight: 500,
                backgroundColor: "transparent",
                cursor: "pointer"
              }}
            >
              条件をクリア
            </button>
          )}
        </div>
      </form>

      <section>
        <h2 style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>
          {keyword ? `検索結果 (${filteredNotes.length}件)` : `マイノート一覧 (${notes.length}件)`}
        </h2>
        <NotesList notes={filteredNotes} onEdit={handleEdit} onDelete={handleDelete} />
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

const searchFormStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "1rem",
  padding: "1rem",
  borderRadius: "0.75rem",
  border: "1px solid rgba(148, 163, 184, 0.2)",
  backgroundColor: "rgba(15, 23, 42, 0.4)"
};
