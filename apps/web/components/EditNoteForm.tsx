"use client";

import { useCallback, useEffect, useState } from "react";
import type { ChangeEvent, CSSProperties, FocusEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { SubmitButton } from "./SubmitButton";
import { FIELD_RULES, type FieldName, validateField } from "./noteValidation";
import { getNote, updateNote, type NoteRecord } from "@/lib/localNotes";

type EditNoteFormProps = {
  noteId: number;
  onSaved?: (note: NoteRecord) => void;
};

export function EditNoteForm({ noteId, onSaved }: EditNoteFormProps) {
  const router = useRouter();
  const [note, setNote] = useState<NoteRecord | null>(null);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    getNote(noteId).then((fetched) => {
      if (!fetched) {
        router.push("/notes");
        return;
      }
      setNote(fetched);
    });
  }, [noteId, router]);

  const handleBlur = useCallback((event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.currentTarget;
    if (!FIELD_RULES[name as FieldName]) {
      return;
    }
    const message = validateField(name as FieldName, value);
    setErrors((prev) => {
      if (!message) {
        const { [name as FieldName]: _removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [name as FieldName]: message };
    });
  }, []);

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.currentTarget;
    if (!FIELD_RULES[name as FieldName]) {
      return;
    }
    setErrors((prev) => {
      if (!(name as FieldName in prev)) {
        return prev;
      }
      const message = validateField(name as FieldName, value);
      if (!message) {
        const { [name as FieldName]: _removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [name as FieldName]: message };
    });
  }, []);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!note) return;
      const form = event.currentTarget;
      const formData = new FormData(form);
      const newErrors: Partial<Record<FieldName, string>> = {};

      (Object.keys(FIELD_RULES) as FieldName[]).forEach((field) => {
        const value = formData.get(field);
        if (typeof value === "string") {
          const message = validateField(field, value);
          if (message) {
            newErrors[field] = message;
          }
        }
      });

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        const firstField = Object.keys(newErrors)[0];
        const element = form.querySelector<HTMLElement>(`[name="${firstField}"]`);
        element?.focus();
        return;
      }

      const whiskyName = String(formData.get("whisky_name") ?? "").trim();
      const distilleryName = String(formData.get("distillery_name") ?? "").trim() || null;
      const region = String(formData.get("region") ?? "").trim() || null;
      const aroma = String(formData.get("aroma") ?? "").trim() || null;
      const flavor = String(formData.get("flavor") ?? "").trim() || null;
      const summary = String(formData.get("summary") ?? "").trim() || null;
      const cask = String(formData.get("cask") ?? "").trim() || null;
      const ratingRaw = formData.get("rating");
      const rating = ratingRaw ? Number(ratingRaw) : null;
      const abvRaw = formData.get("abv");
      const abv = abvRaw ? Number(abvRaw) : null;

      setPending(true);
      try {
        setFormError(null);
        const updated = await updateNote({
          id: note.id,
          whisky_name: whiskyName,
          distillery_name: distilleryName,
          region,
          aroma,
          flavor,
          summary,
          abv,
          cask,
          rating,
          created_at: note.created_at,
          updated_at: note.updated_at
        });
        setNote(updated);
        onSaved?.(updated);
      } catch (error) {
        const message = error instanceof Error ? error.message : "ノートの更新に失敗しました";
        setFormError(message);
      } finally {
        setPending(false);
      }
    },
    [note, onSaved]
  );

  if (!note) {
    return (
      <div style={{ padding: "1rem", opacity: 0.7 }}>
        読み込み中...
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "grid",
        gap: "0.75rem",
        padding: "1rem",
        borderRadius: "0.75rem",
        border: "1px solid rgba(148, 163, 184, 0.2)",
        backgroundColor: "rgba(15, 23, 42, 0.4)"
      }}
    >
      <h3 style={{ fontSize: "1.25rem", marginBottom: "0.25rem" }}>テイスティングノートを編集</h3>
      <p style={{ margin: 0, fontSize: "0.75rem", opacity: 0.6 }}>作成日: {new Date(note.created_at).toLocaleString("ja-JP")}</p>
      <label style={{ display: "grid", gap: "0.35rem" }}>
        <span style={{ fontSize: "0.85rem", opacity: 0.75 }}>銘柄名 *</span>
        <input
          name="whisky_name"
          defaultValue={note.whisky_name}
          placeholder="銘柄名を入力"
          required
          maxLength={100}
          onBlur={handleBlur}
          onChange={handleChange}
          style={inputStyle}
        />
      </label>
      {errors.whisky_name && <ErrorText message={errors.whisky_name} />}
      <label style={{ display: "grid", gap: "0.35rem" }}>
        <span style={{ fontSize: "0.85rem", opacity: 0.75 }}>蒸留所名</span>
        <input
          name="distillery_name"
          defaultValue={note.distillery_name ?? ""}
          placeholder="例: Yamazaki Distillery"
          maxLength={100}
          onBlur={handleBlur}
          onChange={handleChange}
          style={inputStyle}
        />
      </label>
const inputStyle: CSSProperties = {
  padding: "0.6rem 0.8rem",
  borderRadius: "0.5rem",
  border: "1px solid rgba(148, 163, 184, 0.4)",
  backgroundColor: "rgba(15, 23, 42, 0.4)",
  color: "#f8fafc"
};

const textAreaStyle: CSSProperties = {
  ...inputStyle,
  resize: "vertical"
};

const errorTextStyle: CSSProperties = {
  color: "#f87171",
  fontSize: "0.75rem",
  marginTop: "-0.25rem"
};

const formErrorStyle: CSSProperties = {
  ...errorTextStyle,
  marginTop: 0
};

function ErrorText({ message }: { message: string }) {
  return <span style={errorTextStyle}>{message}</span>;
}
