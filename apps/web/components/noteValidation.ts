export type FieldName =
  | "whisky_name"
  | "distillery_name"
  | "region"
  | "aroma"
  | "flavor"
  | "summary"
  | "abv"
  | "cask"
  | "rating";

export type ValidationRule = {
  label: string;
  required?: boolean;
  maxLength?: number;
  min?: number;
  max?: number;
  integer?: boolean;
};

export const FIELD_RULES: Record<FieldName, ValidationRule> = {
  whisky_name: { label: "銘柄名", required: true, maxLength: 100 },
  distillery_name: { label: "蒸留所名", maxLength: 100 },
  region: { label: "産地", maxLength: 100 },
  aroma: { label: "香り", maxLength: 100 },
  flavor: { label: "味わい", maxLength: 100 },
  summary: { label: "総合", maxLength: 200 },
  abv: { label: "アルコール度数", min: 0, max: 100 },
  cask: { label: "樽", maxLength: 100 },
  rating: { label: "総合スコア", min: 0, max: 100, integer: true }
};

export function validateField(name: FieldName, rawValue: string): string | null {
  const rule = FIELD_RULES[name];
  const value = rawValue.trim();

  if (rule.required && !value) {
    return `${rule.label}は必須です`;
  }

  if (rule.maxLength && value.length > rule.maxLength) {
    return `${rule.label}は${rule.maxLength}文字以内で入力してください`;
  }

  if (value && (rule.min !== undefined || rule.max !== undefined)) {
    const num = Number(value);
    if (Number.isNaN(num)) {
      return `${rule.label}は数値で入力してください`;
    }
    if (rule.min !== undefined && num < rule.min) {
      return `${rule.label}は${rule.min}以上で入力してください`;
    }
    if (rule.max !== undefined && num > rule.max) {
      return `${rule.label}は${rule.max}以下で入力してください`;
    }
    if (rule.integer && !Number.isInteger(num)) {
      return `${rule.label}は整数で入力してください`;
    }
  }

  return null;
}

