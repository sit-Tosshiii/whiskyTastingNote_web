"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import type { CSSProperties, FocusEvent, ChangeEvent, FormEvent } from "react";
import { SubmitButton } from "./SubmitButton";
import { FIELD_RULES, type FieldName, validateField } from "./noteValidation";
import aromaVocabularyData from "@/data/generated/aromaVocabulary.json";
import flavorVocabularyData from "@/data/generated/flavorVocabulary.json";
import { KeywordSuggestions } from "./KeywordSuggestions";
import { addNote, type NoteRecord } from "@/lib/localNotes";

type NoteFormProps = {
  onSaved?: (note: NoteRecord) => void;
};

export function NoteForm({ onSaved }: NoteFormProps) {
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const aromaRef = useRef<HTMLTextAreaElement>(null);
  const flavorRef = useRef<HTMLTextAreaElement>(null);
  const [images, setImages] = useState<string[]>([]);
  const [drinkingMethod, setDrinkingMethod] = useState<string>("");

  const aromaVocabulary = useMemo(
    () => ({
      categories: aromaVocabularyData.categories.map(({ id, label, keywords }) => ({ id, label, keywords })),
      vocabulary: aromaVocabularyData.vocabulary
    }),
    []
  );

  const flavorVocabulary = useMemo(
    () => ({
      categories: flavorVocabularyData.categories.map(({ id, label, keywords }) => ({ id, label, keywords })),
      vocabulary: flavorVocabularyData.vocabulary
    }),
    []
  );

  const handleBlur = useCallback((event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = event.currentTarget;
    if (!FIELD_RULES[name as FieldName]) return;
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
    if (!FIELD_RULES[name as FieldName]) return;
    setErrors((prev) => {
      if (!(name as FieldName in prev)) return prev;
      const message = validateField(name as FieldName, event.currentTarget.value);
      if (!message) {
        const { [name as FieldName]: _removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [name as FieldName]: message };
    });
  }, []);

  const handleSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
      const saved = await addNote({
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
        images
      });
      form.reset();
      if (aromaRef.current) aromaRef.current.value = "";
      if (flavorRef.current) flavorRef.current.value = "";
      setImages([]);
      setDrinkingMethod("");
      setErrors({});
      onSaved?.(saved);
    } catch (error) {
      const message = error instanceof Error ? error.message : "ノートの保存に失敗しました";
      setFormError(message);
    } finally {
      setPending(false);
    }
  }, [onSaved, drinkingMethod, images]);

  const appendTermToField = useCallback(
    (field: FieldName, ref: React.RefObject<HTMLTextAreaElement | HTMLInputElement>, term: string) => {
      const target = ref.current;
      if (!target) return;
      const currentValue = target.value.trim();
      const delimiter = currentValue ? "、" : "";
      const existingTokens = currentValue
        ? currentValue.split(/[、,;\/・\s]+/).map((token) => token.trim()).filter(Boolean)
        : [];
      if (existingTokens.includes(term)) return;
      const nextValue = `${currentValue}${delimiter}${term}`.replace(/^\s+/, "");
      target.value = nextValue;
      const inputEvent = new Event("input", { bubbles: true });
      target.dispatchEvent(inputEvent);
      const message = validateField(field, nextValue);
      setErrors((prev) => {
        if (!message) {
          const { [field]: _removed, ...rest } = prev;
          return rest;
        }
        return { ...prev, [field]: message };
      });
    },
    []
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
      <h3 style={{ fontSize: "1.25rem", marginBottom: "0.25rem" }}>テイスティングノートを追加</h3>
      <label style={{ display: "grid", gap: "0.35rem" }}>
        <span style={{ fontSize: "0.85rem", opacity: 0.75 }}>銘柄名*</span>
        <input
          name="whisky_name"
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

      <KeywordSuggestions
        title="香りのヒント"
        description="気になる語句をクリックして追加できます"
        vocabulary={aromaVocabulary}
        onSelect={(term) => appendTermToField("aroma", aromaRef, term)}
        randomCount={10}
        showCategories={false}
      />

      <label style={{ display: "grid", gap: "0.35rem" }}>
        <span style={{ fontSize: "0.85rem", opacity: 0.75 }}>味わい</span>
        <textarea
          name="flavor"
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

      <KeywordSuggestions
        title="味わいのヒント"
        description="よく使われる表現から選べます"
        vocabulary={flavorVocabulary}
        onSelect={(term) => appendTermToField("flavor", flavorRef, term)}
        randomCount={10}
        showCategories={false}
      />

      <label style={{ display: "grid", gap: "0.35rem" }}>
        <span style={{ fontSize: "0.85rem", opacity: 0.75 }}>総合</span>
        <textarea
          name="summary"
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
            onBlur={handleBlur}
            onChange={handleChange}
            style={inputStyle}
          />
        </label>
      </div>
      {errors.rating && <ErrorText message={errors.rating} />}

      <label style={{ display: "grid", gap: "0.35rem" }}>
        <span style={{ fontSize: "0.85rem", opacity: 0.75 }}>画像 (最大5枚)</span>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={async (e) => {
            const files = Array.from(e.target.files || []);
            const limited = files.slice(0, 5);
            const readAsDataUrl = (f: File) => new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(String(reader.result || ""));
              reader.onerror = () => reject(reader.error);
              reader.readAsDataURL(f);
            });
            const urls: string[] = [];
            for (const f of limited) {
              try { urls.push(await readAsDataUrl(f)); } catch {}
            }
            setImages(urls);
          }}
          style={inputStyle}
        />
        {images.length > 0 && (
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
            {images.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={src} alt={`preview-${i}`} style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 6, border: "1px solid rgba(148,163,184,0.3)" }} />
            ))}
          </div>
        )}
      </label>

      <SubmitButton label="ノートを保存" pending={pending} />
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
  marginTop: "0"
};

function ErrorText({ message }: { message: string }) {
  return <span style={errorTextStyle}>{message}</span>;
}
