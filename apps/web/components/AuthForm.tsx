"use client";

import { useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";

export function AuthForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    const payload: Record<string, string> = { email, password };
    if (mode === "register" && displayName) {
      payload.displayName = displayName;
    }

    const response = await fetch(`/api/auth/${mode === "login" ? "login" : "register"}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    setLoading(false);
    if (!response.ok) {
      const data = await response.json();
      setMessage(data.error ?? "エラーが発生しました");
      return;
    }

    setEmail("");
    setPassword("");
    setDisplayName("");
    router.refresh();
  };

  return (
    <div style={{ maxWidth: 360 }}>
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <button
          onClick={() => setMode("login")}
          type="button"
          style={mode === "login" ? activeTabStyle : tabStyle}
        >
          ログイン
        </button>
        <button
          onClick={() => setMode("register")}
          type="button"
          style={mode === "register" ? activeTabStyle : tabStyle}
        >
          新規登録
        </button>
      </div>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "0.75rem" }}>
        {mode === "register" && (
          <label style={{ display: "grid", gap: "0.25rem" }}>
            <span style={labelStyle}>表示名（任意）</span>
            <input
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              placeholder="ウイスキー好き太郎"
              style={inputStyle}
            />
          </label>
        )}
        <label style={{ display: "grid", gap: "0.25rem" }}>
          <span style={labelStyle}>メールアドレス</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="example@example.com"
            required
            style={inputStyle}
          />
        </label>
        <label style={{ display: "grid", gap: "0.25rem" }}>
          <span style={labelStyle}>パスワード</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={6}
            required
            style={inputStyle}
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "0.6rem 0.8rem",
            borderRadius: "0.5rem",
            border: "none",
            background: loading
              ? "rgba(148, 163, 184, 0.3)"
              : "linear-gradient(135deg, #0ea5e9, #6366f1)",
            color: "white",
            fontWeight: 600
          }}
        >
          {loading ? "送信中..." : mode === "login" ? "ログイン" : "登録"}
        </button>
      </form>
      {message && (
        <p
          style={{
            marginTop: "1rem",
            fontSize: "0.875rem",
            color: "#f87171"
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
}

const tabStyle: CSSProperties = {
  flex: 1,
  padding: "0.5rem 0.75rem",
  borderRadius: "0.5rem",
  border: "1px solid rgba(148, 163, 184, 0.3)",
  backgroundColor: "transparent",
  color: "#f8fafc",
  fontWeight: 600
};

const activeTabStyle: CSSProperties = {
  ...tabStyle,
  background: "linear-gradient(135deg, #22d3ee, #6366f1)",
  border: "none"
};

const inputStyle: CSSProperties = {
  padding: "0.6rem 0.8rem",
  borderRadius: "0.5rem",
  border: "1px solid rgba(148, 163, 184, 0.4)",
  backgroundColor: "rgba(15, 23, 42, 0.4)",
  color: "#f8fafc"
};

const labelStyle: CSSProperties = {
  fontSize: "0.875rem",
  opacity: 0.8
};
