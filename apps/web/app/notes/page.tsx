import Link from "next/link";
import { redirect } from "next/navigation";
import type { CSSProperties } from "react";
import { AuthMenu } from "@/components/AuthMenu";
import { NotesList } from "@/components/NotesList";
import { getSession } from "@/lib/session";
import { query } from "@/lib/db";

type NotesPageProps = {
  searchParams?: {
    q?: string;
  };
};

type NoteRow = {
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
  image_path: string | null;
  rating: number | null;
  created_at: string;
};

async function fetchNotes(userId: number, keyword: string) {
  const params: Array<number | string> = [userId];
  let sql = `
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
      image_path,
      rating,
      created_at
    from tasting_notes
    where user_id = $1
  `;

  if (keyword) {
    params.push(`%${keyword}%`);
    sql += `
      and (
        whisky_name ilike $2
        or coalesce(distillery_name, '') ilike $2
        or coalesce(region, '') ilike $2
        or coalesce(cask, '') ilike $2
        or coalesce(aroma, '') ilike $2
        or coalesce(flavor, '') ilike $2
        or coalesce(summary, '') ilike $2
        or coalesce(abv::text, '') ilike $2
        or coalesce(image_path, '') ilike $2
      )
    `;
  }

  sql += " order by created_at desc";

  return query<NoteRow>(sql, params);
}

export default async function NotesPage({ searchParams }: NotesPageProps) {
  const session = getSession();
  if (!session) {
    redirect("/");
  }

  const keyword = typeof searchParams?.q === "string" ? searchParams.q.trim() : "";
  const notes = await fetchNotes(session.userId, keyword);

  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: "1.5rem", display: "grid", gap: "1.5rem" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>ノートを検索・閲覧</h1>
          <p style={{ margin: 0, opacity: 0.8 }}>キーワードでフィルタリングして記録を探す</p>
        </div>
        <AuthMenu email={session.email} />
      </header>

      <nav style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        <Link href="/" style={linkButtonStyle}>
          ホーム
        </Link>
        <Link href="/notes/new" style={linkButtonStyle}>
          ノートを登録
        </Link>
      </nav>

      <form method="get" style={searchFormStyle}>
        <div style={{ flex: "1 1 auto", display: "grid", gap: "0.35rem" }}>
          <label htmlFor="note-search" style={{ fontSize: "0.75rem", opacity: 0.7 }}>
            キーワード検索
          </label>
          <input
            id="note-search"
            name="q"
            defaultValue={keyword}
            placeholder="銘柄名 / 蒸留所 / 産地 / 樽 / テイスティングメモ / 総合"
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
            <Link
              href="/notes"
              style={{
                padding: "0.6rem 1rem",
                borderRadius: "0.5rem",
                border: "1px solid rgba(148, 163, 184, 0.2)",
                color: "#f8fafc",
                fontWeight: 500,
                textDecoration: "none"
              }}
            >
              条件をクリア
            </Link>
          )}
        </div>
      </form>

      <section>
        <h2 style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>
          {keyword ? `検索結果 (${notes.length}件)` : "マイノート一覧"}
        </h2>
        <NotesList notes={notes} />
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
