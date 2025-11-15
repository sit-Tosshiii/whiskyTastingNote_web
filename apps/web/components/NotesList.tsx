"use client";

import { useState } from "react";
import type { NoteRecord } from "@/lib/localNotes";

type TastingNote = NoteRecord;

type Props = {
  notes: TastingNote[];
  onEdit: (noteId: number) => void;
  onDelete: (noteId: number) => void;
};

export function NotesList({ notes, onEdit, onDelete }: Props) {
  const [expanded, setExpanded] = useState<Set<number>>(() => new Set());

  if (!notes.length) {
    return <p style={{ opacity: 0.7 }}>まだテイスティングノートがありません。最初の1件を記録しましょう。</p>;
  }

  return (
    <ul style={{ display: "grid", gap: "0.75rem" }}>
      {notes.map((note) => {
        const id = note.id ?? -1;
        const isOpen = id !== -1 && expanded.has(id);
        const toggle = () => {
          if (id === -1) return;
          setExpanded((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id); else next.add(id);
            return next;
          });
        };
        return (
          <li
            key={note.id}
            onClick={toggle}
            style={{
              padding: "1rem",
              borderRadius: "0.75rem",
              border: "1px solid rgba(148, 163, 184, 0.2)",
              backgroundColor: "rgba(15, 23, 42, 0.4)",
              display: "grid",
              gap: "0.5rem"
            }}
          >
            <header style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <h3 style={{ fontSize: "1.125rem" }}>{note.whisky_name}</h3>
              {note.rating !== null && (
                <span style={{ fontWeight: 600, color: "#38bdf8" }}>{note.rating} / 100</span>
              )}
            </header>

            {!isOpen ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {note.distillery_name && (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.35rem",
                      padding: "0.25rem 0.5rem",
                      borderRadius: "9999px",
                      border: "1px solid rgba(148, 163, 184, 0.3)",
                      fontSize: "0.75rem",
                      opacity: 0.85
                    }}
                  >
                    <strong style={{ fontWeight: 600 }}>蒸留所</strong>
                    <span>{note.distillery_name}</span>
                  </span>
                )}
                {note.region && (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.35rem",
                      padding: "0.25rem 0.5rem",
                      borderRadius: "9999px",
                      border: "1px solid rgba(148, 163, 184, 0.3)",
                      fontSize: "0.75rem",
                      opacity: 0.85
                    }}
                  >
                    <strong style={{ fontWeight: 600 }}>産地</strong>
                    <span>{note.region}</span>
                  </span>
                )}
              </div>
            ) : (
              <MetadataRow note={note} />
            )}

            {isOpen && note.drinking_method && <Field label="飲み方" value={note.drinking_method} />}
            {isOpen && note.aroma && <Field label="香り" value={note.aroma} />}
            {isOpen && note.flavor && <Field label="味わい" value={note.flavor} />}
            {isOpen && note.summary && <Field label="総合" value={note.summary} />}

            {isOpen && Array.isArray((note as any).images) && (note as any).images.length > 0 && (
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {(note as any).images.map((src: string, i: number) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={i} src={src} alt={`image-${i}`} style={{ width: 96, height: 96, objectFit: "cover", borderRadius: 6, border: "1px solid rgba(148,163,184,0.3)" }} />
                ))}
              </div>
            )}

            {isOpen && (
              <footer style={{ fontSize: "0.75rem", opacity: 0.6 }}>
                {new Date(note.created_at).toLocaleString("ja-JP")}
              </footer>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); note.id !== undefined && onEdit(note.id); }}
                style={{
                  padding: "0.3rem 0.75rem",
                  borderRadius: "9999px",
                  border: "1px solid rgba(148, 163, 184, 0.35)",
                  color: "#38bdf8",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  backgroundColor: "transparent",
                  cursor: "pointer"
                }}
              >
                編集
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); note.id !== undefined && onDelete(note.id); }}
                style={{
                  padding: "0.3rem 0.75rem",
                  borderRadius: "9999px",
                  border: "1px solid rgba(248, 113, 113, 0.35)",
                  backgroundColor: "rgba(239, 68, 68, 0.12)",
                  color: "#f87171",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                削除
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span style={{ fontSize: "0.75rem", opacity: 0.6 }}>{label}</span>
      <p style={{ margin: 0, marginTop: "0.25rem", lineHeight: 1.5 }}>{value}</p>
    </div>
  );
}

function MetadataRow({ note }: { note: TastingNote }) {
  const items: { label: string; value: string }[] = [];

  if (note.distillery_name) items.push({ label: "蒸留所", value: note.distillery_name });
  if (note.region) items.push({ label: "産地", value: note.region });
  if (typeof note.abv === "number" && Number.isFinite(note.abv)) {
    const display = note.abv % 1 === 0 ? note.abv.toFixed(0) : note.abv.toFixed(1);
    items.push({ label: "ABV", value: `${display}%` });
  }
  if (note.cask) items.push({ label: "樽", value: note.cask });

  if (!items.length) return null;

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
      {items.map((item) => (
        <span
          key={`${item.label}-${item.value}`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.35rem",
            padding: "0.25rem 0.5rem",
            borderRadius: "9999px",
            border: "1px solid rgba(148, 163, 184, 0.3)",
            fontSize: "0.75rem",
            opacity: 0.85
          }}
        >
          <strong style={{ fontWeight: 600 }}>{item.label}</strong>
          <span>{item.value}</span>
        </span>
      ))}
    </div>
  );
}

