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
  created_at: string;
  updated_at: string;
};

export type NoteInput = Omit<NoteRecord, "id" | "created_at" | "updated_at">;

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
  return notes.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
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
  const note: NoteRecord = { ...input, created_at: timestamp, updated_at: timestamp };
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
  const updated = { ...note, updated_at: new Date().toISOString() };
  await wrapRequest(store.put(updated));
  return updated;
}

export async function deleteNote(id: number): Promise<void> {
  const db = await openDb();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);
  await wrapRequest(store.delete(id));
}

