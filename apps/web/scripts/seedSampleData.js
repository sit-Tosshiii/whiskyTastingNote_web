"use strict";

const { Pool } = require("pg");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

const TARGET_EMAIL = "it.chshi17623.m1@gmail.com";
const DEFAULT_PASSWORD = "password";
const DEFAULT_DISPLAY_NAME = "動作確認ユーザー";
const CASK_CANDIDATES = ["バーボン樽", "シェリー樽", "リフィルホグスヘッド", "ポートパイプ", "ミズナラ樽"];

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL が設定されていません。docker compose の web コンテナから実行してください。");
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    const client = await pool.connect();
    try {
      await client.query("begin");

      let userId;
      const existingUser = await client.query("select id from users where email = $1", [TARGET_EMAIL]);
      if (existingUser.rows.length) {
        userId = existingUser.rows[0].id;
      } else {
        const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);
        const inserted = await client.query(
          "insert into users (email, password_hash, display_name) values ($1, $2, $3) returning id",
          [TARGET_EMAIL, passwordHash, DEFAULT_DISPLAY_NAME]
        );
        userId = inserted.rows[0].id;
      }

      const dataPath = path.join(__dirname, "..", "data", "distilleries.json");
      const raw = fs.readFileSync(dataPath, "utf8");
      const records = JSON.parse(raw);
      let insertedCount = 0;

      const clampText = (value, maxLength) => {
        if (value === null || value === undefined) return null;
        const text = value.toString().trim();
        return text ? text.slice(0, maxLength) : null;
      };

      for (let index = 0; index < records.length; index += 1) {
        const record = records[index];
        const whiskyName = clampText(record["蒸留所名(日本語表記)"], 100);
        if (!whiskyName) continue;

        const distilleryName = clampText(record["蒸留所名(英語表記)"], 100);
        const region = clampText(record["産地"], 100);
        const aroma = clampText(record["アロマ"], 100);
        const flavor = clampText(record["フレーバー"], 100);
        const summary = clampText(record["総合評価"], 200);
        const ratingValue = record["SCORE"];
        const rating =
          typeof ratingValue === "number" && Number.isFinite(ratingValue)
            ? Math.max(0, Math.min(100, Math.round(ratingValue)))
            : null;
        const abv = Number((40 + (index % 20) * 0.7).toFixed(1));
        const cask = CASK_CANDIDATES[index % CASK_CANDIDATES.length];

        const result = await client.query(
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
          )
          select $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11
          where not exists (
            select 1 from tasting_notes
            where user_id = $1 and whisky_name = $2
          )`,
          [
            userId,
            whiskyName,
            distilleryName,
            region,
            abv,
            cask,
            aroma,
            flavor,
            summary,
            null,
            rating
          ]
        );
        if (result.rowCount > 0) {
          insertedCount += 1;
        }
      }

      await client.query("commit");
      console.log(`Seed 完了: ユーザー ${TARGET_EMAIL} にノート ${insertedCount} 件を登録しました。`);
      if (!existingUser.rows.length) {
        console.log(`ログイン用パスワード: ${DEFAULT_PASSWORD}`);
      } else {
        console.log("既存ユーザーにデータを追加しました。既存パスワードは変更されていません。");
      }
    } catch (error) {
      await client.query("rollback");
      throw error;
    } finally {
      client.release();
    }
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error("シード処理でエラーが発生しました:", error);
  process.exit(1);
});
