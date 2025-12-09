"use client";

import type { NoteRecord } from "./localNotes";

const DEFAULT_APP_URL = "https://whiskytastingnote-web.pages.dev";
const HASHTAG = "#WhiskyTastingNote";
const URL_WEIGHT = 23; // X counts any URL as 23 characters
const URL_PATTERN = /(https?:\/\/[^\s]+)/gi;

const appUrl = process.env.NEXT_PUBLIC_APP_URL || DEFAULT_APP_URL;

function tweetLength(text: string): number {
  const replaced = text.replace(URL_PATTERN, "x".repeat(URL_WEIGHT));
  return Array.from(replaced).length;
}

function buildFirstTweet(note: NoteRecord, summary: string, addEllipsis: boolean): string {
  const header = `銘柄: ${note.whisky_name}`;
  const scoreLine = typeof note.rating === "number" ? `スコア: ${note.rating}/100` : null;
  const summaryLine = summary ? `総合: ${summary}${addEllipsis ? "…" : ""}` : null;
  const parts = [header, scoreLine, summaryLine, appUrl, HASHTAG].filter(Boolean);
  return parts.join("\n");
}

function forceTrimToLimit(text: string, limit = 280): string {
  if (tweetLength(text) <= limit) return text;
  const units = Array.from(text);
  let end = units.length;
  let trimmed = text;
  while (end > 0 && tweetLength(trimmed) > limit) {
    end -= 1;
    trimmed = `${units.slice(0, end).join("")}…`;
  }
  return trimmed;
}

function splitContinuation(body: string): string[] {
  const units = Array.from(body.trim());
  if (!units.length) return [];

  const tweets: string[] = [];
  let cursor = 0;
  while (cursor < units.length) {
    let chunkLength = Math.min(units.length - cursor, 260);
    let chunk = units.slice(cursor, cursor + chunkLength).join("");
    while (chunkLength > 0 && tweetLength(`続き: ${chunk}`) > 280) {
      chunkLength -= 1;
      chunk = units.slice(cursor, cursor + chunkLength).join("");
    }
    if (!chunk) {
      chunk = units[cursor];
      chunkLength = 1;
    }
    tweets.push(`続き: ${chunk}`);
    cursor += chunkLength;
  }

  return tweets;
}

export function buildTweetPlan(note: NoteRecord): { primary: string; overflow: string[] } {
  const summaryText = (note.summary ?? "").trim();
  const fullFirst = buildFirstTweet(note, summaryText, false);
  if (tweetLength(fullFirst) <= 280) {
    return { primary: fullFirst, overflow: [] };
  }

  const summaryUnits = Array.from(summaryText);
  let used = summaryUnits.length;
  let primary = fullFirst;

  while (used > 0 && tweetLength(primary) > 280) {
    used -= 1;
    const shortened = summaryUnits.slice(0, used).join("");
    primary = buildFirstTweet(note, shortened, true);
  }

  if (tweetLength(primary) > 280) {
    primary = forceTrimToLimit(primary, 280);
    return { primary, overflow: [] };
  }

  const remainder = used < summaryUnits.length ? summaryUnits.slice(used).join("") : "";
  const overflow = remainder ? splitContinuation(remainder) : [];
  return { primary, overflow };
}

export function buildIntentUrl(text: string): string {
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
}
