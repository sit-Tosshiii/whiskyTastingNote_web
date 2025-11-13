"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

  const aromaRef = useRef<HTMLTextAreaElement>(null);
  const flavorRef = useRef<HTMLTextAreaElement>(null);
  const [drinkingMethod, setDrinkingMethod] = useState<string>("");
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    getNote(noteId).then((fetched) => {
      if (!fetched) {
        router.push("/notes");
        return;
      }
      setNote({ images: [], drinking_method: null, ...fetched, images: Array.isArray((fetched as any).images) ? (fetched as any).images as string[] : [] });
      setDrinkingMethod((fetched as any).drinking_method ?? "");
      setImages(Array.isArray((fetched as any).images) ? ((fetched as any).images as string[]) : []);
    });
  }, [noteId, router]);

  const handleBlur = useCallback((event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.currentTarget;
    if (!FIELD_RULES[name as FieldName]) return;
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
    if (!FIELD_RULES[name as FieldName]) return;
    setErrors((prev) => {
      if (!(name as FieldName in prev)) return prev;
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
          if (message) newErrors[field] = message;
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
          drinking_method: drinkingMethod || null,
          images,
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
    [note, onSaved, drinkingMethod, images]
  );

  const onAddImages = async (fileList: FileList | null) => {
    const files = Array.from(fileList || []);
    if (!files.length) return;
    const readAsDataUrl = (f: File) => new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(f);
    });
    const existing = images.slice(0, 5);
    for (const f of files) {
      if (existing.length >= 5) break;
      try { existing.push(await readAsDataUrl(f)); } catch { /* noop */ }
    }
    setImages(existing.slice(0, 5));
  };

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
      <h3 style={{ fontSize: "1.25rem", marginBottom: "0.25rem" }}>テイスティングノートを編集</h3>
      <p style={{ margin: 0, fontSize: "0.75rem", opacity: 0.6 }}>作成日: {new Date(note.created_at).toLocaleString("ja-JP")}</p>

      <label style={{ display: "grid", gap: "0.35rem" }}>
        <span style={{ fontSize: "0.85rem", opacity: 0.75 }}>銘柄名*</span>
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
        <span style={{ fontSize: "0.85rem", opacity: 0.75 }}>蒸留所</span>
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
          placeholder="例: 日本 / スコットランド（アイラなど）"
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
          ref={aromaRef}
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
          ref={flavorRef}
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

      <label style={{ display: "grid", gap: "0.35rem" }}>
        <span style={{ fontSize: "0.85rem", opacity: 0.75 }}>飲み方</span>
        <select
          name="drinking_method"
          value={drinkingMethod}
          onChange={(e) => setDrinkingMethod(e.target.value)}
          style={inputStyle as any}
        >
          <option value="">選択してください</option>
          <option value="ストレート">ストレート</option>
          <option value="トワイスアップ">トワイスアップ</option>
          <option value="ロック">ロック</option>
          <option value="水割り">水割り</option>
          <option value="ソーダ割り">ソーダ割り</option>
          <option value="その他">その他</option>
        </select>
      </label>
      {errors.drinking_method && <ErrorText message={errors.drinking_method} />}

      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <label style={{ display: "grid", gap: "0.35rem", flex: "1 1 140px" }}>
          <span style={{ fontSize: "0.85rem", opacity: 0.75 }}>アルコール度数 (ABV)</span>
          <input
            name="abv"
            type="number"
            min={0}
            max={100}
            step={0.1}
            placeholder="46"
            defaultValue={note.abv ?? undefined}
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
            min={0}
            max={100}
            step={1}
            placeholder="85"
            defaultValue={note.rating ?? undefined}
            onBlur={handleBlur}
            onChange={handleChange}
            style={inputStyle}
          />
        </label>
      </div>
      {errors.rating && <ErrorText message={errors.rating} />}

      <div style={{ display: "grid", gap: "0.35rem" }}>
        <span style={{ fontSize: "0.85rem", opacity: 0.75 }}>画像 (最大5枚)</span>
        {images.length > 0 && (
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {images.map((src, i) => (
              <div key={i} style={{ position: "relative" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`preview-${i}`} style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 6, border: "1px solid rgba(148,163,184,0.3)" }} />
                <button
                  type="button"
                  onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                  style={{ position: "absolute", top: -6, right: -6, padding: "0.1rem 0.35rem", borderRadius: 9999, border: "1px solid rgba(248,113,113,0.5)", background: "rgba(239,68,68,0.9)", color: "#fff", fontSize: 10, cursor: "pointer" }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => onAddImages(e.target.files)}
          style={inputStyle}
        />
      </div>

      <SubmitButton label="ノートを更新" pending={pending} />
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

