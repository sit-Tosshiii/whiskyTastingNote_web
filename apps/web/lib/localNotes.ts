"use client";

export type NoteRecord = {
  id?: number;
  whisky_name: string;
  distillery_name: string | null;
  region: string | null;
  aroma: string | null;
  flavor: string | null;
  summary: string | null;
  abv: number | null;
  cask: string | null;
  rating: number | null;
  drinking_method: string | null;
  images: string[];
  created_at: string;
  updated_at: string;
};

export type NoteInput = Omit<NoteRecord, "id" | "created_at" | "updated_at">;
export type ImportMode = "append" | "replace";
export type ImportStats = {
  processed: number;
  added: number;
  skipped: number;
  mode: ImportMode;
};

const DB_NAME = "whisky-notes";
const DB_VERSION = 1;
const STORE_NAME = "notes";

function openDb(): Promise<IDBDatabase> {
  if (typeof indexedDB === "undefined") {
    return Promise.reject(new Error("IndexedDB is not available"));
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
        store.createIndex("created_at", "created_at", { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function wrapRequest<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getAllNotes(): Promise<NoteRecord[]> {
  const db = await openDb();
  const tx = db.transaction(STORE_NAME, "readonly");
  const store = tx.objectStore(STORE_NAME);
  const notes = await wrapRequest<NoteRecord[]>(store.getAll());
  // ensure defaults for backward compatibility
  const normalized = notes.map((n) => ({
    images: [],
    drinking_method: null,
    ...n,
    images: Array.isArray((n as any).images) ? (n as any).images as string[] : []
  }));
  return normalized.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function getNote(id: number): Promise<NoteRecord | undefined> {
  const db = await openDb();
  const tx = db.transaction(STORE_NAME, "readonly");
  const store = tx.objectStore(STORE_NAME);
  return wrapRequest<NoteRecord | undefined>(store.get(id));
}

export async function addNote(input: NoteInput): Promise<NoteRecord> {
  const db = await openDb();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);
  const timestamp = new Date().toISOString();
  const note: NoteRecord = {
    images: [],
    drinking_method: null,
    ...input,
    images: Array.isArray((input as any).images) ? (input as any).images as string[] : [],
    created_at: timestamp,
    updated_at: timestamp
  };
  const id = await wrapRequest<number>(store.add(note));
  return { ...note, id };
}

export async function updateNote(note: NoteRecord): Promise<NoteRecord> {
  if (typeof note.id !== "number") {
    throw new Error("Note id is required");
  }
  const db = await openDb();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);
  const updated = {
    images: Array.isArray((note as any).images) ? (note as any).images as string[] : [],
    drinking_method: (note as any).drinking_method ?? null,
    ...note,
    updated_at: new Date().toISOString()
  } as NoteRecord;
  await wrapRequest(store.put(updated));
  return updated;
}

export async function deleteNote(id: number): Promise<void> {
  const db = await openDb();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);
  await wrapRequest(store.delete(id));
}

function sanitizeString(value: unknown, maxLength?: number): string | null {
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return null;
    return typeof maxLength === "number" ? trimmed.slice(0, maxLength) : trimmed;
  }
  if (value === null || value === undefined) return null;
  return sanitizeString(String(value), maxLength);
}

function sanitizeNumber(value: unknown, options?: { min?: number; max?: number }): number | null {
  const num = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(num)) return null;
  const min = options?.min ?? -Infinity;
  const max = options?.max ?? Infinity;
  return Math.min(Math.max(num, min), max);
}

function sanitizeDate(value: unknown): string | null {
  if (typeof value === "string") {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) {
      return date.toISOString();
    }
  }
  return null;
}

export async function importNotesFromJson(raw: unknown, mode: ImportMode = "append"): Promise<ImportStats> {
  const array = Array.isArray(raw) ? raw : [];
  const db = await openDb();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);

  if (mode === "replace") {
    store.clear();
  }

  const existingNames = mode === "append"
    ? new Set((await getAllNotes()).map((note) => note.whisky_name))
    : new Set<string>();

  let added = 0;
  let skipped = 0;

  for (let i = 0; i < array.length; i += 1) {
    const item = array[i] ?? {};
    const whiskyName = sanitizeString((item as Record<string, unknown>).whisky_name, 100);
    if (!whiskyName) {
      skipped += 1;
      continue;
    }

    if (existingNames.has(whiskyName)) {
      skipped += 1;
      continue;
    }

    const payload: NoteRecord = {
      whisky_name: whiskyName,
      distillery_name: sanitizeString((item as Record<string, unknown>).distillery_name, 100),
      region: sanitizeString((item as Record<string, unknown>).region, 100),
      aroma: sanitizeString((item as Record<string, unknown>).aroma, 100),
      flavor: sanitizeString((item as Record<string, unknown>).flavor, 100),
      summary: sanitizeString((item as Record<string, unknown>).summary, 200),
      cask: sanitizeString((item as Record<string, unknown>).cask, 100),
      abv: sanitizeNumber((item as Record<string, unknown>).abv, { min: 0, max: 100 }),
      rating: sanitizeNumber((item as Record<string, unknown>).rating, { min: 0, max: 100 }),
      drinking_method: sanitizeString((item as Record<string, unknown>).drinking_method, 40),
      images: Array.isArray((item as Record<string, unknown>).images)
        ? ((item as any).images as unknown[]).filter((x) => typeof x === "string") as string[]
        : [],
      created_at: sanitizeDate((item as Record<string, unknown>).created_at) ?? new Date().toISOString(),
      updated_at: sanitizeDate((item as Record<string, unknown>).updated_at) ?? new Date().toISOString()
    };

    const request = payload.id ? store.put(payload) : store.add(payload);
    try {
      await wrapRequest(request);
      existingNames.add(whiskyName);
      added += 1;
    } catch (error) {
      console.error("Failed to import note", error);
      skipped += 1;
    }
  }

  await new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });

  return {
    processed: array.length,
    added,
    skipped,
    mode
  };
}

export async function clearAllNotes(): Promise<void> {
  const db = await openDb();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);
  store.clear();
  await new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}
