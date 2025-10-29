"use strict";

const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");

async function main() {
  const dataPath = path.join(__dirname, "..", "data", "distilleries.json");
  const raw = fs.readFileSync(dataPath, "utf8");
  const records = JSON.parse(raw);

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const targetEmail = "it.chshi17623.m1@gmail.com";

  const { rows } = await pool.query("select id from users where email = $1", [targetEmail]);
  if (!rows.length) {
    throw new Error(`ユーザーが見つかりません: ${targetEmail}`);
  }
  const userId = rows[0].id;

  const caskOptions = ["バーボン樽", "シェリー樽", "リフィルホグスヘッド", "新樽", "ポートパイプ"];
  let inserted = 0;

  for (const record of records) {
    const whiskyName = (record["蒸留所名(日本語表記)"] || "").toString().trim();
    if (!whiskyName) continue;

    const distilleryName = record["蒸留所名(英語表記)"] || null;
    const region = record["産地"] || null;
    const aroma = record["アロマ"] || null;
    const flavor = record["フレーバー"] || null;
    const summary = record["総合評価"] || null;
    const ratingValue = record["SCORE"];
    const rating =
      typeof ratingValue === "number" && Number.isFinite(ratingValue)
        ? Math.max(0, Math.min(100, Math.round(ratingValue)))
        : null;
    const abv = Math.round((35 + Math.random() * 35) * 10) / 10;
    const cask = caskOptions[Math.floor(Math.random() * caskOptions.length)];

    await pool.query(
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
        rating
      ) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [userId, whiskyName, distilleryName, region, abv, cask, aroma, flavor, summary, rating]
    );

    inserted += 1;
  }

  await pool.end();
  console.log(`Inserted ${inserted} tasting notes for ${targetEmail}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
