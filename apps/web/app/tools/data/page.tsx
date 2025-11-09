"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import type { CSSProperties, ChangeEvent } from "react";
import { clearAllNotes, getAllNotes, importNotesFromJson, type ImportMode, type ImportStats } from "@/lib/localNotes";

export default function DataToolsPage() {
  const [exporting, setExporting] = useState(false);
  const [importMode, setImportMode] = useState<ImportMode>("append");
  const [importStats, setImportStats] = useState<ImportStats | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [clearing, setClearing] = useState(false);

  const handleExport = useCallback(async () => {
    setExporting(true);
    try {
      const notes = await getAllNotes();
      if (!notes.length) {
        alert("エクスポートできるノートがありません");
        return;
      }
      const blob = new Blob([JSON.stringify(notes, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      anchor.href = url;
      anchor.download = `whisky-notes-${timestamp}.json`;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert("エクスポートに失敗しました");
    } finally {
      setExporting(false);
    }
  }, []);

  const handleImportModeChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setImportMode(event.target.value as ImportMode);
  }, []);

  const handleImportFile = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      setImportStats(null);
      setImportError(null);
      try {
        const text = await file.text();
        const json = JSON.parse(text);
        const stats = await importNotesFromJson(json, importMode);
        setImportStats(stats);
      } catch (error) {
        console.error(error);
        setImportError("JSON の読み込みまたは取り込みに失敗しました");
      } finally {
        event.target.value = "";
      }
    },
    [importMode]
  );

  const importSummary = useMemo(() => {
    if (importError) {
      return <p style={errorTextStyle}>{importError}</p>;
    }
    if (!importStats) return null;
    return (
      <p style={{ margin: 0 }}>
        {`処理件数: ${importStats.processed} / 追加: ${importStats.added} / スキップ: ${importStats.skipped} （モード: ${
          importStats.mode === "replace" ? "置き換え" : "追記"
        }）`}
      </p>
    );
  }, [importStats, importError]);

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "1.5rem", display: "grid", gap: "1.5rem" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>データ入出力ツール</h1>
          <p style={{ margin: 0, opacity: 0.8 }}>IndexedDB に保存されているノートを JSON でバックアップ / 復元できます。</p>
        </div>
        <nav style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <Link href="/" style={linkButtonStyle}>
            ホーム
          </Link>
          <Link href="/notes" style={linkButtonStyle}>
            ノート一覧
          </Link>
          <Link href="/notes/new" style={linkButtonStyle}>
            ノート登録
          </Link>
        </nav>
      </header>

      <section style={cardStyle}>
        <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>1. JSON にエクスポート</h2>
        <p style={{ margin: 0 }}>端末に保存されているノートをすべて JSON ファイルとしてダウンロードします。</p>
        <button
          type="button"
          onClick={handleExport}
          disabled={exporting}
          style={{
            marginTop: "0.75rem",
            alignSelf: "flex-start",
            padding: "0.75rem 1.25rem",
            borderRadius: "0.5rem",
            border: "none",
            fontWeight: 600,
            color: "#0f172a",
            background: exporting ? "rgba(148,163,184,0.4)" : "linear-gradient(135deg,#22d3ee,#38bdf8)",
            cursor: exporting ? "not-allowed" : "pointer"
          }}
        >
          {exporting ? "エクスポート中..." : "JSON をダウンロード"}
        </button>
      </section>

      <section style={cardStyle}>
        <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>2. JSON からインポート</h2>
        <p style={{ margin: 0 }}>バックアップした JSON を選択して取り込みます。ファイル形式はエクスポートと同じ構造です。</p>
        <div style={{ display: "flex", gap: "1rem", marginTop: "0.75rem", flexWrap: "wrap" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.9rem" }}>
            <input type="radio" name="import-mode" value="append" checked={importMode === "append"} onChange={handleImportModeChange} />
            既存データに追記
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.9rem" }}>
            <input type="radio" name="import-mode" value="replace" checked={importMode === "replace"} onChange={handleImportModeChange} />
            既存データを置き換え
          </label>
        </div>
        <input
          type="file"
          accept="application/json,.json"
          onChange={handleImportFile}
          style={{ marginTop: "0.75rem" }}
        />
        {importSummary}
      </section>

      <section style={cardStyle}>
        <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>3. すべてのノートを削除</h2>
        <p style={{ margin: 0 }}>IndexedDB に保存されているノートを完全に削除します。実行前に必ずバックアップを取得してください。</p>
        <button
          type="button"
          onClick={async () => {
            if (clearing) return;
            const confirmed = window.confirm("すべてのノートを削除します。よろしいですか？");
            if (!confirmed) {
              return;
            }
            setClearing(true);
            try {
              await clearAllNotes();
              setImportStats(null);
              setImportError(null);
              alert("すべてのノートを削除しました");
            } catch (error) {
              console.error(error);
              alert("ノートの削除に失敗しました");
            } finally {
              setClearing(false);
            }
          }}
          disabled={clearing}
          style={{
            marginTop: "0.75rem",
            alignSelf: "flex-start",
            padding: "0.75rem 1.25rem",
            borderRadius: "0.5rem",
            border: "1px solid rgba(248, 113, 113, 0.4)",
            background: clearing ? "rgba(248,113,113,0.2)" : "rgba(248,113,113,0.25)",
            color: "#fee2e2",
            fontWeight: 600,
            cursor: clearing ? "not-allowed" : "pointer"
          }}
        >
          {clearing ? "削除中..." : "すべて削除"}
        </button>
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

const cardStyle: CSSProperties = {
  padding: "1.25rem",
  borderRadius: "0.75rem",
  border: "1px solid rgba(148, 163, 184, 0.2)",
  backgroundColor: "rgba(15, 23, 42, 0.4)",
  display: "grid",
  gap: "0.6rem"
};

const errorTextStyle: CSSProperties = {
  color: "#f87171",
  fontSize: "0.85rem",
  margin: 0
};
