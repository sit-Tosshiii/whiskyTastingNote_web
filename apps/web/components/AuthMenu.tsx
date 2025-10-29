"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

interface AuthMenuProps {
  email?: string | null;
}

export function AuthMenu({ email }: AuthMenuProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignOut = useCallback(async () => {
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.refresh();
  }, [router]);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
      <span style={{ fontSize: "0.875rem", opacity: 0.8 }}>{email ?? "ログイン中"}</span>
      <button
        onClick={handleSignOut}
        disabled={loading}
        style={{
          padding: "0.4rem 0.75rem",
          borderRadius: "9999px",
          border: "1px solid rgba(148, 163, 184, 0.4)",
          backgroundColor: "rgba(15, 23, 42, 0.4)",
          color: "#f8fafc",
          fontSize: "0.75rem",
          fontWeight: 600
        }}
      >
        {loading ? "サインアウト中..." : "サインアウト"}
      </button>
    </div>
  );
}
