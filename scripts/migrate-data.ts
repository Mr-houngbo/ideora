/**
 * One-off migration: copies rows from the original Supabase `projets` table
 * (read-only, never modified) into the new Neon `projects` table, and
 * re-uploads each project image to Cloudflare R2.
 *
 * Usage: npm run migrate:data
 */
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { projects } from "../src/db/schema";

const SUPABASE_URL = requireEnv("SUPABASE_URL");
const SUPABASE_ANON_KEY = requireEnv("SUPABASE_ANON_KEY");
const DATABASE_URL = requireEnv("DATABASE_URL");
const R2_ACCOUNT_ID = requireEnv("R2_ACCOUNT_ID");
const R2_ACCESS_KEY_ID = requireEnv("R2_ACCESS_KEY_ID");
const R2_SECRET_ACCESS_KEY = requireEnv("R2_SECRET_ACCESS_KEY");
const R2_BUCKET_NAME = requireEnv("R2_BUCKET_NAME");
const R2_PUBLIC_URL = requireEnv("R2_PUBLIC_URL");

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

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

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

async function reuploadImage(sourceUrl: string): Promise<string> {
  const res = await fetch(sourceUrl);
  if (!res.ok) {
    throw new Error(`Failed to download image ${sourceUrl}: ${res.status}`);
  }

  const contentType = res.headers.get("content-type") ?? "application/octet-stream";
  const extension = sourceUrl.split(".").pop()?.split("?")[0] ?? "bin";
  const key = `${crypto.randomUUID()}.${extension}`;
  const buffer = Buffer.from(await res.arrayBuffer());

  await r2.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  );

  return `${R2_PUBLIC_URL}/${key}`;
}

async function main() {
  console.log("Reading source rows from Supabase (read-only)...");
  const sourceRows = await fetchSourceRows();
  console.log(`Found ${sourceRows.length} project(s) to migrate.`);

  let migrated = 0;
  let imagesMigrated = 0;

  for (const row of sourceRows) {
    let imageUrl: string | null = null;

    if (row.image_url) {
      try {
        imageUrl = await reuploadImage(row.image_url);
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
      imageUrl,
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
