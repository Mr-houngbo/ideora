/**
 * One-off migration: reads the exported `data.csv` (a dump of the original
 * Supabase `projets` table) and inserts each row into the new Neon
 * `projects` table, downloading each project image (still publicly
 * reachable from the old Supabase storage bucket) and storing it as base64
 * directly in the new row.
 *
 * Usage: npm run migrate:data -- path/to/data.csv   (defaults to ./data.csv)
 */
import "dotenv/config";
import { readFileSync } from "node:fs";
import { parse } from "csv-parse/sync";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { projects } from "../src/db/schema";

const DATABASE_URL = requireEnv("DATABASE_URL");
const csvPath = process.argv[2] ?? "./data.csv";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}. Copy .env.example to .env and fill it in.`);
  }
  return value;
}

interface CsvRow {
  id: string;
  titre: string;
  categorie: string;
  description_courte: string;
  description_detaillee: string;
  statut: string;
  horizon_temps: string;
  tags: string;
  motivation: string;
  ressources: string;
  date_creation: string;
  est_public: string;
  image_url: string;
}

const sql = neon(DATABASE_URL);
const db = drizzle(sql);

function parseTags(raw: string): string[] {
  if (!raw.trim()) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function parseTimestamp(raw: string): Date {
  // Postgres exports timestamptz as "2025-12-11 13:15:43.47095+00" — normalize
  // to a strict ISO-8601 string ("...T...Z") so `new Date()` parses it reliably.
  const isoLike = raw.trim().replace(" ", "T").replace(/\+00$/, "Z");
  const date = new Date(isoLike);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Unparseable date_creation value: "${raw}"`);
  }
  return date;
}

async function downloadImage(sourceUrl: string): Promise<{ data: string; mimeType: string }> {
  const res = await fetch(sourceUrl);
  if (!res.ok) {
    throw new Error(`Failed to download image ${sourceUrl}: ${res.status}`);
  }

  const mimeType = res.headers.get("content-type") ?? "application/octet-stream";
  const buffer = Buffer.from(await res.arrayBuffer());

  return { data: buffer.toString("base64"), mimeType };
}

async function main() {
  console.log(`Reading ${csvPath}...`);
  const fileContent = readFileSync(csvPath, "utf-8");
  const rows: CsvRow[] = parse(fileContent, {
    columns: true,
    delimiter: ";",
    relax_quotes: true,
    skip_empty_lines: true,
  });
  console.log(`Found ${rows.length} project(s) to migrate.`);

  let migrated = 0;
  let imagesMigrated = 0;

  for (const row of rows) {
    let imageData: string | null = null;
    let imageMimeType: string | null = null;

    if (row.image_url.trim()) {
      try {
        const image = await downloadImage(row.image_url.trim());
        imageData = image.data;
        imageMimeType = image.mimeType;
        imagesMigrated++;
      } catch (error) {
        console.error(`  ! Failed to migrate image for "${row.titre}" (${row.id}):`, error);
      }
    }

    await db.insert(projects).values({
      id: row.id,
      titre: row.titre,
      categorie: row.categorie || null,
      descriptionCourte: row.description_courte || null,
      descriptionDetaillee: row.description_detaillee || null,
      statut: row.statut || "idee",
      horizonTemps: row.horizon_temps || "moyen_terme",
      tags: parseTags(row.tags),
      motivation: row.motivation || null,
      ressources: row.ressources || null,
      dateCreation: parseTimestamp(row.date_creation),
      imageData,
      imageMimeType,
    });

    migrated++;
    console.log(`  ✓ [${migrated}/${rows.length}] ${row.titre}`);
  }

  console.log("\nDone.");
  console.log(`  Rows migrated:   ${migrated} / ${rows.length}`);
  console.log(`  Images migrated: ${imagesMigrated}`);
  console.log("\nVerify manually: compare this count and a few titles/dates against data.csv");
  console.log("before considering the migration done.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
