"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session";
import { query } from "@/lib/db";
import { mkdir, writeFile, unlink } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

type NoteFieldPayload = {
  whiskyName: string;
  distilleryName: string | null;
  region: string | null;
  aroma: string | null;
  flavor: string | null;
  summary: string | null;
  cask: string | null;
  rating: number | null;
  abv: number | null;
};

function validateNoteConstraints(payload: NoteFieldPayload) {
  const {
    whiskyName,
    distilleryName,
    region,
    aroma,
    flavor,
    summary,
    cask,
    rating,
    abv
  } = payload;

  if (!whiskyName) {
    throw new Error("銘柄名は必須です");
  }
  if (whiskyName.length > 100) {
    throw new Error("銘柄名は100文字以内で入力してください");
  }
  if (distilleryName && distilleryName.length > 100) {
    throw new Error("蒸留所名は100文字以内で入力してください");
  }
  if (region && region.length > 100) {
    throw new Error("産地は100文字以内で入力してください");
  }
  if (aroma && aroma.length > 100) {
    throw new Error("香りは100文字以内で入力してください");
  }
  if (flavor && flavor.length > 100) {
    throw new Error("味わいは100文字以内で入力してください");
  }
  if (summary && summary.length > 200) {
    throw new Error("総合は200文字以内で入力してください");
  }
  if (cask && cask.length > 100) {
    throw new Error("樽は100文字以内で入力してください");
  }
  if (rating !== null && (Number.isNaN(rating) || rating < 0 || rating > 100)) {
    throw new Error("評価スコアは0〜100の範囲で入力してください");
  }
  if (abv !== null && (Number.isNaN(abv) || abv < 0 || abv > 100)) {
    throw new Error("アルコール度数は0〜100の範囲で入力してください");
  }
}

async function saveImageFile(image: File): Promise<string> {
  if (!image.type.startsWith("image/")) {
    throw new Error("画像ファイルを選択してください");
  }
  if (image.size > MAX_IMAGE_BYTES) {
    throw new Error("画像サイズは5MB以下にしてください");
  }

  const arrayBuffer = await image.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const extension = (() => {
    const nameMatch = image.name?.split(".").pop();
    if (nameMatch) {
      return nameMatch.toLowerCase();
    }
    const mimeMatch = image.type.split("/").pop();
    return mimeMatch ?? "png";
  })();
  const sanitizedExtension = extension.replace(/[^a-z0-9]/g, "") || "png";
  const fileName = `${randomUUID()}.${sanitizedExtension}`;
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });
  await writeFile(path.join(uploadsDir, fileName), buffer);
  return `/uploads/${fileName}`;
}

async function deleteImageFile(imagePath: string | null) {
  if (!imagePath) return;
  const relative = imagePath.startsWith("/") ? imagePath.slice(1) : imagePath;
  const filePath = path.join(process.cwd(), "public", relative);
  try {
    await unlink(filePath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
  }
}

export async function createTastingNote(formData: FormData) {
  const session = getSession();
  if (!session) {
    throw new Error("ログインが必要です");
  }

  const whiskyName = String(formData.get("whisky_name") ?? "").trim();
  const distilleryName = String(formData.get("distillery_name") ?? "").trim() || null;
  const region = String(formData.get("region") ?? "").trim() || null;
  const cask = String(formData.get("cask") ?? "").trim() || null;
  const aroma = String(formData.get("aroma") ?? "").trim() || null;
  const flavor = String(formData.get("flavor") ?? "").trim() || null;
  const formEntries = Object.fromEntries(formData);
  const summaryFieldName = "summary" in formEntries ? "summary" : ("finish" in formEntries ? "finish" : "summary");
  const summary = String(formData.get(summaryFieldName) ?? "").trim() || null;
  const ratingRaw = formData.get("rating");
  const rating = ratingRaw ? Number(ratingRaw) : null;
  const abvRaw = formData.get("abv");
  const abv = abvRaw ? Number(abvRaw) : null;
  const image = formData.get("image");
  let imagePath: string | null = null;

  validateNoteConstraints({
    whiskyName,
    distilleryName,
    region,
    aroma,
    flavor,
    summary,
    cask,
    rating,
    abv
  });

  if (image instanceof File && image.size > 0) {
    imagePath = await saveImageFile(image);
  }

  await query(
    `insert into tasting_notes (
      user_id,
      whisky_name,
      distillery_name,
      region,
      abv,
      cask,
      aroma,
      flavor,
      summary,
      image_path,
      rating
    ) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
    [session.userId, whiskyName, distilleryName, region, abv, cask, aroma, flavor, summary, imagePath, rating]
  );

  revalidatePath("/");
  revalidatePath("/notes");
}

type ExistingNoteRow = {
  id: number;
  user_id: number;
  image_path: string | null;
};

export async function updateTastingNote(formData: FormData) {
  const session = getSession();
  if (!session) {
    throw new Error("ログインが必要です");
  }

  const noteIdRaw = formData.get("note_id");
  const noteId = noteIdRaw ? Number(noteIdRaw) : NaN;
  if (!Number.isInteger(noteId)) {
    throw new Error("ノートIDが不正です");
  }

  const existingRows = await query<ExistingNoteRow>(
    "select id, user_id, image_path from tasting_notes where id = $1 and user_id = $2",
    [noteId, session.userId]
  );
  const existing = existingRows[0];

  if (!existing) {
    throw new Error("ノートが見つかりません");
  }

  const whiskyName = String(formData.get("whisky_name") ?? "").trim();
  const distilleryName = String(formData.get("distillery_name") ?? "").trim() || null;
  const region = String(formData.get("region") ?? "").trim() || null;
  const cask = String(formData.get("cask") ?? "").trim() || null;
  const aroma = String(formData.get("aroma") ?? "").trim() || null;
  const flavor = String(formData.get("flavor") ?? "").trim() || null;
  const summary = String(formData.get("summary") ?? "").trim() || null;
  const ratingRaw = formData.get("rating");
  const rating = ratingRaw ? Number(ratingRaw) : null;
  const abvRaw = formData.get("abv");
  const abv = abvRaw ? Number(abvRaw) : null;
  const image = formData.get("image");

  validateNoteConstraints({
    whiskyName,
    distilleryName,
    region,
    aroma,
    flavor,
    summary,
    cask,
    rating,
    abv
  });

  let imagePath = existing.image_path;
  if (image instanceof File && image.size > 0) {
    const newImagePath = await saveImageFile(image);
    if (existing.image_path && existing.image_path !== newImagePath) {
      await deleteImageFile(existing.image_path);
    }
    imagePath = newImagePath;
  }

  await query(
    `update tasting_notes
      set whisky_name = $1,
          distillery_name = $2,
          region = $3,
          abv = $4,
          cask = $5,
          aroma = $6,
          flavor = $7,
          summary = $8,
          image_path = $9,
          rating = $10
      where id = $11 and user_id = $12`,
    [whiskyName, distilleryName, region, abv, cask, aroma, flavor, summary, imagePath, rating, noteId, session.userId]
  );

  revalidatePath("/");
  revalidatePath("/notes");
}

export async function deleteTastingNote(formData: FormData) {
  const session = getSession();
  if (!session) {
    throw new Error("ログインが必要です");
  }

  const noteIdRaw = formData.get("note_id");
  const noteId = noteIdRaw ? Number(noteIdRaw) : NaN;
  if (!Number.isInteger(noteId)) {
    throw new Error("ノートIDが不正です");
  }

  const deleted = await query<{ image_path: string | null }>(
    "delete from tasting_notes where id = $1 and user_id = $2 returning image_path",
    [noteId, session.userId]
  );

  const imagePath = deleted[0]?.image_path ?? null;

  if (imagePath) {
    try {
      await deleteImageFile(imagePath);
    } catch (error) {
      console.error("画像の削除に失敗しました:", error);
    }
  }

  if (!deleted.length) {
    throw new Error("ノートが見つかりません");
  }

  revalidatePath("/");
  revalidatePath("/notes");
}
