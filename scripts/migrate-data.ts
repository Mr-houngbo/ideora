/**
 * One-off migration: copies rows from the original Supabase `projets` table
 * (read-only, never modified) into the new Neon `projects` table, downloading
 * each project image and storing it as base64 directly in the new row.
 *
 * Usage: npm run migrate:data
 */
import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { projects } from "../src/db/schema";

const SUPABASE_URL = requireEnv("SUPABASE_URL");
const SUPABASE_ANON_KEY = requireEnv("SUPABASE_ANON_KEY");
const DATABASE_URL = requireEnv("DATABASE_URL");

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}. Copy .env.example to .env.local and fill it in.`);
  }
  return value;
}

interface SupabaseProjectRow {
  id: string;
  titre: string;
  categorie: string | null;
  description_courte: string | null;
  description_detaillee: string | null;
  statut: string | null;
  horizon_temps: string | null;
  tags: string[] | null;
  motivation: string | null;
  ressources: string | null;
  date_creation: string;
  est_public: boolean | null;
  image_url: string | null;
}

const sql = neon(DATABASE_URL);
const db = drizzle(sql);

async function fetchSourceRows(): Promise<SupabaseProjectRow[]> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/projets?select=*&order=date_creation.asc`, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to read source table: ${res.status} ${await res.text()}`);
  }

  return res.json();
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
  console.log("Reading source rows from Supabase (read-only)...");
  const sourceRows = await fetchSourceRows();
  console.log(`Found ${sourceRows.length} project(s) to migrate.`);

  let migrated = 0;
  let imagesMigrated = 0;

  for (const row of sourceRows) {
    let imageData: string | null = null;
    let imageMimeType: string | null = null;

    if (row.image_url) {
      try {
        const image = await downloadImage(row.image_url);
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
      categorie: row.categorie,
      descriptionCourte: row.description_courte,
      descriptionDetaillee: row.description_detaillee,
      statut: row.statut ?? "idee",
      horizonTemps: row.horizon_temps ?? "moyen_terme",
      tags: row.tags ?? [],
      motivation: row.motivation,
      ressources: row.ressources,
      dateCreation: new Date(row.date_creation),
      estPublic: row.est_public ?? false,
      imageData,
      imageMimeType,
    });

    migrated++;
    console.log(`  ✓ [${migrated}/${sourceRows.length}] ${row.titre}`);
  }

  console.log("\nDone.");
  console.log(`  Rows migrated:   ${migrated} / ${sourceRows.length}`);
  console.log(`  Images migrated: ${imagesMigrated}`);
  console.log("\nVerify manually: compare this count and a few titles/dates against the Supabase dashboard");
  console.log("before considering the source project safe to decommission.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
