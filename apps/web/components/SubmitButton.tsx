"use client";

interface SubmitButtonProps {
  label: string;
  pending?: boolean;
}

export function SubmitButton({ label, pending = false }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={pending}
      style={{
        padding: "0.6rem 0.8rem",
        borderRadius: "0.5rem",
        border: "none",
        background: pending
          ? "rgba(148, 163, 184, 0.3)"
          : "linear-gradient(135deg, #22d3ee, #6366f1)",
        color: "white",
        fontWeight: 600,
        cursor: pending ? "not-allowed" : "pointer",
        transition: "opacity 0.2s ease"
      }}
    >
      {pending ? "保存中..." : label}
    </button>
  );
}
