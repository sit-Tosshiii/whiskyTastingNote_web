"use client";

import { useCallback, useState, useTransition } from "react";
import type { ChangeEvent, CSSProperties, FocusEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { updateTastingNote } from "@/app/actions";
import { SubmitButton } from "./SubmitButton";
import { FIELD_RULES, type FieldName, validateField } from "./noteValidation";

type NoteFormValues = {
  id: number;
  whisky_name: string;
  distillery_name: string | null;
  region: string | null;
  aroma: string | null;
  flavor: string | null;
  summary: string | null;
  abv: string | null;
  cask: string | null;
  rating: number | null;
  image_path: string | null;
};

export function EditNoteForm({ note }: { note: NoteFormValues }) {
  const router = useRouter();
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const handleBlur = useCallback((event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = event.currentTarget;
    if (!FIELD_RULES[name as FieldName]) {
      return;
    }
    const message = validateField(name as FieldName, event.currentTarget.value);
    setErrors((prev) => {
      if (!message) {
        const { [name as FieldName]: _removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [name as FieldName]: message };
    });
  }, []);

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = event.currentTarget;
    if (!FIELD_RULES[name as FieldName]) {
      return;
    }
    setErrors((prev) => {
      if (!(name as FieldName in prev)) {
        return prev;
      }
      const message = validateField(name as FieldName, event.currentTarget.value);
      if (!message) {
        const { [name as FieldName]: _removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [name as FieldName]: message };
    });
  }, []);

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
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

      startTransition(async () => {
        try {
          setFormError(null);
          await updateTastingNote(formData);
          router.push("/notes");
          router.refresh();
        } catch (error) {
          const message = error instanceof Error ? error.message : "ノートの更新に失敗しました";
          setFormError(message);
        }
      });
    },
    [router]
  );

  return (
    <form
      onSubmit={handleSubmit}
      encType="multipart/form-data"
      style={{
        display: "grid",
        gap: "0.75rem",
        padding: "1rem",
        borderRadius: "0.75rem",
        border: "1px solid rgba(148, 163, 184, 0.2)",
        backgroundColor: "rgba(15, 23, 42, 0.4)"
      }}
    >
      <input type="hidden" name="note_id" value={note.id} />
      <h3 style={{ fontSize: "1.25rem", marginBottom: "0.25rem" }}>テイスティングノートを編集</h3>
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
      {errors.distillery_name && <ErrorText message={errors.distillery_name} />}
      <label style={{ display: "grid", gap: "0.35rem" }}>
        <span style={{ fontSize: "0.85rem", opacity: 0.75 }}>産地</span>
        <input
          name="region"
          defaultValue={note.region ?? ""}
          placeholder="例: 日本 / スコットランド・アイラ"
          maxLength={100}
          onBlur={handleBlur}
          onChange={handleChange}
          style={inputStyle}
        />
      </label>
      {errors.region && <ErrorText message={errors.region} />}
      <label style={{ display: "grid", gap: "0.35rem" }}>
        <span style={{ fontSize: "0.85rem", opacity: 0.75 }}>香り</span>
        <textarea
          name="aroma"
          defaultValue={note.aroma ?? ""}
          placeholder="香りの印象"
          rows={2}
          maxLength={100}
          onBlur={handleBlur}
          onChange={handleChange}
          style={textAreaStyle}
        />
      </label>
      {errors.aroma && <ErrorText message={errors.aroma} />}
      <label style={{ display: "grid", gap: "0.35rem" }}>
        <span style={{ fontSize: "0.85rem", opacity: 0.75 }}>味わい</span>
        <textarea
          name="flavor"
          defaultValue={note.flavor ?? ""}
          placeholder="味のメモ"
          rows={2}
          maxLength={100}
          onBlur={handleBlur}
          onChange={handleChange}
          style={textAreaStyle}
        />
      </label>
      {errors.flavor && <ErrorText message={errors.flavor} />}
      <label style={{ display: "grid", gap: "0.35rem" }}>
        <span style={{ fontSize: "0.85rem", opacity: 0.75 }}>総合</span>
        <textarea
          name="summary"
          defaultValue={note.summary ?? ""}
          placeholder="全体の印象"
          rows={3}
          maxLength={200}
          onBlur={handleBlur}
          onChange={handleChange}
          style={textAreaStyle}
        />
      </label>
      {errors.summary && <ErrorText message={errors.summary} />}
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <label style={{ display: "grid", gap: "0.35rem", flex: "1 1 140px" }}>
          <span style={{ fontSize: "0.85rem", opacity: 0.75 }}>アルコール度数 (ABV)</span>
          <input
            name="abv"
            type="number"
            defaultValue={note.abv ?? ""}
            min={0}
            max={100}
            step={0.1}
            placeholder="46"
            onBlur={handleBlur}
            onChange={handleChange}
            style={inputStyle}
          />
        </label>
        {errors.abv && <ErrorText message={errors.abv} />}
        <label style={{ display: "grid", gap: "0.35rem", flex: "1 1 140px" }}>
          <span style={{ fontSize: "0.85rem", opacity: 0.75 }}>樽</span>
          <input
            name="cask"
            defaultValue={note.cask ?? ""}
            placeholder="例: バーボン樽 / シェリー樽"
            maxLength={100}
            onBlur={handleBlur}
            onChange={handleChange}
            style={inputStyle}
          />
        </label>
        {errors.cask && <ErrorText message={errors.cask} />}
        <label style={{ display: "grid", gap: "0.35rem", flex: "1 1 140px" }}>
          <span style={{ fontSize: "0.85rem", opacity: 0.75 }}>総合スコア (0-100)</span>
          <input
            name="rating"
            type="number"
            defaultValue={note.rating ?? ""}
            min={0}
            max={100}
            step={1}
            placeholder="85"
            onBlur={handleBlur}
            onChange={handleChange}
            style={inputStyle}
          />
        </label>
      </div>
      {errors.rating && <ErrorText message={errors.rating} />}
      <label style={{ display: "grid", gap: "0.35rem" }}>
        <span style={{ fontSize: "0.85rem", opacity: 0.75 }}>画像 (再アップロードで差し替え)</span>
        <input
          name="image"
          type="file"
          accept="image/*"
          style={fileInputStyle}
        />
        {note.image_path && (
          <span style={{ fontSize: "0.75rem", opacity: 0.6 }}>
            現在の画像: <a href={note.image_path} target="_blank" rel="noreferrer" style={{ color: "#38bdf8" }}>{note.image_path}</a>
          </span>
        )}
      </label>
      <SubmitButton label="変更を保存" pending={pending} />
      {formError && <p style={formErrorStyle}>{formError}</p>}
    </form>
  );
}

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

const fileInputStyle: CSSProperties = {
  ...inputStyle,
  padding: "0.4rem 0.8rem",
  cursor: "pointer"
};

const errorTextStyle: CSSProperties = {
  color: "#f87171",
  fontSize: "0.75rem",
  marginTop: "-0.25rem"
};

const formErrorStyle: CSSProperties = {
  ...errorTextStyle,
  marginTop: "0"
};

function ErrorText({ message }: { message: string }) {
  return <span style={errorTextStyle}>{message}</span>;
}
