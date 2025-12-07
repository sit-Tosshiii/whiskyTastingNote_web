"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import type { NoteRecord } from "@/lib/localNotes";
import { buildIntentUrl, buildTweetPlan } from "@/lib/tweetIntent";

type ShareToXProps = {
  note: NoteRecord;
  compact?: boolean;
};

export function ShareToX({ note, compact = false }: ShareToXProps) {
  const [copied, setCopied] = useState(false);
  const { primary, overflow } = useMemo(() => buildTweetPlan(note), [note]);

  const handleOpenIntent = () => {
    const url = buildIntentUrl(primary);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleCopyOverflow = async () => {
    if (!overflow.length) return;
    try {
      await navigator.clipboard.writeText(overflow.join("\n\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
      alert("クリップボードへのコピーに失敗しました");
    }
  };

  return (
    <section
      style={{
        ...containerStyle,
        padding: compact ? "0.75rem" : "1rem",
        backgroundColor: compact ? "rgba(15, 23, 42, 0.35)" : "rgba(15, 23, 42, 0.45)"
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
        <div style={{ display: "grid", gap: "0.2rem", minWidth: 0 }}>
          <span style={{ fontSize: "0.8rem", opacity: 0.75 }}>Xでシェア</span>
          <strong style={{ fontSize: "1rem", lineHeight: 1.4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {note.whisky_name}
          </strong>
          {note.rating !== null && <span style={{ fontSize: "0.85rem", opacity: 0.8 }}>スコア: {note.rating} / 100</span>}
        </div>
        <button type="button" onClick={handleOpenIntent} style={shareButtonStyle}>
          Xで投稿を準備
        </button>
      </div>

      <div style={previewBoxStyle}>
        <p style={previewTextStyle}>{primary}</p>
      </div>

      <div style={{ display: "grid", gap: "0.5rem" }}>
        <p style={{ fontSize: "0.8rem", opacity: 0.7, margin: 0 }}>
          写真は投稿画面で添付してください。
        </p>
        {overflow.length > 0 && (
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.8rem", opacity: 0.75 }}>文字数超過分は返信で貼り付けてください。</span>
            <button type="button" onClick={handleCopyOverflow} style={copyButtonStyle}>
              {copied ? "コピーしました" : "続きをコピー"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

const containerStyle: CSSProperties = {
  borderRadius: "0.75rem",
  border: "1px solid rgba(148, 163, 184, 0.25)",
  display: "grid",
  gap: "0.75rem"
};

const shareButtonStyle: CSSProperties = {
  padding: "0.55rem 1rem",
  borderRadius: "9999px",
  border: "1px solid rgba(96, 165, 250, 0.4)",
  backgroundColor: "rgba(96, 165, 250, 0.12)",
  color: "#bfdbfe",
  fontWeight: 700,
  cursor: "pointer",
  whiteSpace: "nowrap"
};

const previewBoxStyle: CSSProperties = {
  borderRadius: "0.6rem",
  border: "1px dashed rgba(148, 163, 184, 0.25)",
  backgroundColor: "rgba(15, 23, 42, 0.35)",
  padding: "0.75rem"
};

const previewTextStyle: CSSProperties = {
  margin: 0,
  whiteSpace: "pre-wrap",
  fontSize: "0.9rem",
  lineHeight: 1.5,
  opacity: 0.9
};

const copyButtonStyle: CSSProperties = {
  padding: "0.45rem 0.85rem",
  borderRadius: "9999px",
  border: "1px solid rgba(148, 163, 184, 0.35)",
  backgroundColor: "rgba(15, 23, 42, 0.2)",
  color: "#e2e8f0",
  fontWeight: 600,
  cursor: "pointer",
  fontSize: "0.85rem"
};
