"use strict";

const fs = require("fs");
const path = require("path");

const PROJECT_ROOT = path.join(__dirname, "..");
const DATA_DIR = path.join(PROJECT_ROOT, "data");
const SOURCE_JSON = path.join(DATA_DIR, "distilleries.json");
const CATEGORY_JSON = path.join(DATA_DIR, "flavorCategories.json");
const OUTPUT_DIR = path.join(DATA_DIR, "generated");

const FIELD_CONFIG = [
  { field: "アロマ", output: "aromaVocabulary.json" },
  { field: "フレーバー", output: "flavorVocabulary.json" }
];

function loadJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function normalizeTerm(raw) {
  if (raw === null || raw === undefined) return null;
  const term = raw
    .toString()
    .normalize("NFKC")
    .replace(/\s+/g, " ")
    .trim();
  if (!term) return null;
  if (term.length < 2) return null;
  return term;
}

function tokenize(text) {
  if (!text) return [];
  const normalized = text.toString().normalize("NFKC");
  return normalized
    .split(/[、。,，\/・\n\r\t ]+/u)
    .map((token) => normalizeTerm(token))
    .filter(Boolean);
}

function buildCounters(records, field) {
  const counter = new Map();
  for (const record of records) {
    const tokens = tokenize(record[field]);
    tokens.forEach((token) => {
      counter.set(token, (counter.get(token) ?? 0) + 1);
    });
  }
  return counter;
}

function createCategoryMap(categoryConfig) {
  const map = new Map();
  for (const category of categoryConfig.categories) {
    map.set(category.id, {
      id: category.id,
      label: category.label,
      match: category.match,
      keywords: []
    });
  }
  if (!map.has("other")) {
    map.set("other", { id: "other", label: "その他", match: [], keywords: [] });
  }
  return map;
}

function assignCategory(term, categoryMap) {
  for (const category of categoryMap.values()) {
    if (category.id === "other" || !category.match?.length) continue;
    if (category.match.some((pattern) => term.includes(pattern))) {
      return category.id;
    }
  }
  return "other";
}

function buildVocabulary(counter, categoryConfig) {
  const categoryMap = createCategoryMap(categoryConfig);
  const allKeywords = [];

  [...counter.entries()]
    .sort((a, b) => b[1] - a[1])
    .forEach(([term, count]) => {
      const categoryId = assignCategory(term, categoryMap);
      const category = categoryMap.get(categoryId);
      category.keywords.push({ term, count });
      allKeywords.push({ term, count, categoryId });
    });

  for (const category of categoryMap.values()) {
    category.keywords.sort((a, b) => b.count - a.count);
  }

  const categories = [...categoryMap.values()].filter((cat) => cat.keywords.length > 0 || cat.id === "other");

  return {
    metadata: {
      source: path.basename(SOURCE_JSON),
      generatedAt: new Date().toISOString(),
      totalTerms: counter.size,
      totalOccurrences: [...counter.values()].reduce((sum, value) => sum + value, 0)
    },
    categories,
    vocabulary: allKeywords
  };
}

function ensureOutputDir() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
}

function main() {
  const records = loadJson(SOURCE_JSON);
  const categoryConfig = loadJson(CATEGORY_JSON);
  ensureOutputDir();

  FIELD_CONFIG.forEach(({ field, output }) => {
    const counter = buildCounters(records, field);
    const vocabulary = buildVocabulary(counter, categoryConfig);
    const outPath = path.join(OUTPUT_DIR, output);
    fs.writeFileSync(outPath, JSON.stringify(vocabulary, null, 2), "utf8");
    console.log(`Generated ${output}: ${vocabulary.metadata.totalTerms} terms`);
  });
}

main();
