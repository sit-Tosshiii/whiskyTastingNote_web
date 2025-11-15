"use client";

import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";

type Keyword = {
  term: string;
  count: number;
  categoryId: string;
};

type Category = {
  id: string;
  label: string;
  keywords: Array<{ term: string; count: number }>;
};

type Vocabulary = {
  categories: Category[];
  vocabulary: Keyword[];
};

type KeywordSuggestionsProps = {
  title: string;
  description?: string;
  vocabulary: Vocabulary;
  onSelect: (term: string) => void;
  randomCount?: number;
  maxCategoryItems?: number;
  showCategories?: boolean;
};

function pickRandomKeywords(source: Keyword[], count: number) {
  if (source.length === 0 || count <= 0) return [];
  const shuffled = [...source];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export function KeywordSuggestions({
  title,
  description,
  vocabulary,
  onSelect,
  randomCount = 3,
  maxCategoryItems = 12,
  showCategories = true
}: KeywordSuggestionsProps) {
  const availableCategories = useMemo(
    () => vocabulary.categories.filter((category) => category.keywords.length > 0),
    [vocabulary.categories]
  );
  const flatKeywords = useMemo(() => vocabulary.vocabulary, [vocabulary.vocabulary]);

  const [randomKeywords, setRandomKeywords] = useState(() =>
    flatKeywords.slice(0, Math.min(randomCount, flatKeywords.length))
  );
  const [activeCategoryId, setActiveCategoryId] = useState(() => availableCategories[0]?.id ?? null);

  useEffect(() => {
    setRandomKeywords(pickRandomKeywords(flatKeywords, randomCount));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flatKeywords.length, randomCount]);

  const activeCategory = useMemo(
    () => availableCategories.find((category) => category.id === activeCategoryId) ?? null,
    [availableCategories, activeCategoryId]
  );

  const categoryKeywords = useMemo(() => {
    if (!activeCategory) return [];
    return activeCategory.keywords.slice(0, maxCategoryItems);
  }, [activeCategory, maxCategoryItems]);

  const handleInsert = (term: string) => {
    onSelect(term);
  };

  const refreshRandomKeywords = () => {
    setRandomKeywords(pickRandomKeywords(flatKeywords, randomCount));
  };

  if (!availableCategories.length && randomKeywords.length === 0) {
    return null;
  }

  return (
    <section style={containerStyle}>
      <header style={titleHeaderStyle}>
        <div style={{ display: "grid", gap: "0.25rem" }}>
          <strong style={{ fontSize: "0.85rem" }}>{title}</strong>
          {description && (
            <span style={{ fontSize: "0.75rem", opacity: 0.7 }}>
              {description}
            </span>
          )}
        </div>
      </header>

      {randomKeywords.length > 0 && (
        <div style={randomSectionStyle}>
          <div style={sectionHeaderStyle}>
            <span style={sectionTitleStyle}>🎲 ランダム候補</span>
            {flatKeywords.length > 0 && (
              <button type="button" onClick={refreshRandomKeywords} style={refreshButtonStyle}>
                入れ替える
              </button>
            )}
          </div>
          <div style={randomListStyle}>
            {randomKeywords.map((keyword) => (
              <button
                key={`random-${keyword.term}`}
                type="button"
                onClick={() => handleInsert(keyword.term)}
                style={randomChipStyle}
              >
                {keyword.term}
              </button>
            ))}
          </div>
        </div>
      )}

      <div style={{ ...categorySectionStyle, display: showCategories ? "grid" : "none" }}>
        <div style={sectionHeaderStyle}>
          <span style={sectionTitleStyle}>📚 カテゴリから探す</span>
        </div>
        <nav style={categoryNavStyle}>
          {availableCategories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setActiveCategoryId(category.id)}
              style={{
                ...categoryButtonStyle,
                ...(category.id === activeCategoryId ? categoryButtonActiveStyle : {})
              }}
            >
              {category.label}
            </button>
          ))}
        </nav>

        {categoryKeywords.length > 0 && (
          <div style={categoryKeywordsStyle}>
            {categoryKeywords.map((keyword) => (
              <button
                key={`${activeCategory?.id}-${keyword.term}`}
                type="button"
                onClick={() => handleInsert(keyword.term)}
                style={categoryChipStyle}
              >
                <span style={chipPlusStyle}>＋</span>
                <span>{keyword.term}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

const containerStyle: CSSProperties = {
  display: "grid",
  gap: "0.5rem",
  padding: "0.75rem",
  borderRadius: "0.75rem",
  border: "1px solid rgba(148, 163, 184, 0.25)",
  backgroundColor: "rgba(15, 23, 42, 0.32)"
};

const titleHeaderStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "0.75rem",
  flexWrap: "wrap"
};

const refreshButtonStyle: CSSProperties = {
  padding: "0.25rem 0.6rem",
  borderRadius: "9999px",
  border: "1px solid rgba(148, 163, 184, 0.4)",
  backgroundColor: "rgba(56, 189, 248, 0.1)",
  color: "#38bdf8",
  fontSize: "0.75rem",
  cursor: "pointer"
};

const sectionHeaderStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "0.5rem"
};

const sectionTitleStyle: CSSProperties = {
  fontSize: "0.8rem",
  fontWeight: 600,
  color: "#cbd5f5"
};

const randomSectionStyle: CSSProperties = {
  display: "grid",
  gap: "0.4rem",
  padding: "0.6rem",
  borderRadius: "0.65rem",
  background: "rgba(56, 189, 248, 0.08)"
};

const randomListStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "0.4rem"
};

const randomChipStyle: CSSProperties = {
  padding: "0.35rem 0.7rem",
  borderRadius: "9999px",
  border: "1px solid rgba(56, 189, 248, 0.35)",
  backgroundColor: "rgba(56, 189, 248, 0.2)",
  color: "#0ea5e9",
  fontSize: "0.75rem",
  cursor: "pointer"
};

const categorySectionStyle: CSSProperties = {
  display: "grid",
  gap: "0.5rem",
  padding: "0.6rem",
  borderRadius: "0.65rem",
  background: "rgba(71, 85, 105, 0.35)"
};

const categoryNavStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "0.4rem"
};

const categoryButtonStyle: CSSProperties = {
  padding: "0.3rem 0.6rem",
  borderRadius: "9999px",
  border: "1px solid rgba(148, 163, 184, 0.2)",
  backgroundColor: "rgba(15, 23, 42, 0.4)",
  color: "#f8fafc",
  fontSize: "0.75rem",
  cursor: "pointer"
};

const categoryButtonActiveStyle: CSSProperties = {
  borderColor: "rgba(56, 189, 248, 0.6)",
  backgroundColor: "rgba(56, 189, 248, 0.15)",
  color: "#38bdf8"
};

const categoryKeywordsStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "0.4rem"
};

const categoryChipStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.35rem",
  padding: "0.4rem 0.75rem",
  borderRadius: "0.6rem",
  border: "1px solid rgba(148, 163, 184, 0.35)",
  backgroundColor: "rgba(15, 23, 42, 0.55)",
  color: "#f8fafc",
  fontSize: "0.75rem",
  cursor: "pointer"
};

const chipPlusStyle: CSSProperties = {
  fontSize: "0.75rem",
  opacity: 0.7
};
