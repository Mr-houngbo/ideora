/**
 * One-off: flags a project row to render through a hand-built React showcase
 * component (see src/components/showcase) instead of the generic detail view.
 *
 * Usage: npx tsx scripts/set-custom-template.ts "Perseus" perseus
 */
import "dotenv/config";
import { eq } from "drizzle-orm";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { projects } from "../src/db/schema";

const DATABASE_URL = requireEnv("DATABASE_URL");

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}. Copy .env.example to .env and fill it in.`);
  }
  return value;
}

const [titre, templateKey] = process.argv.slice(2);

if (!titre || !templateKey) {
  console.error('Usage: npx tsx scripts/set-custom-template.ts "<titre exact du projet>" <clé du template>');
  console.error('Example: npx tsx scripts/set-custom-template.ts "Perseus" perseus');
  process.exit(1);
}

const sql = neon(DATABASE_URL);
const db = drizzle(sql);

async function main() {
  const [row] = await db.select({ id: projects.id }).from(projects).where(eq(projects.titre, titre)).limit(1);

  if (!row) {
    console.error(`Aucun projet trouvé avec le titre exact "${titre}".`);
    process.exit(1);
  }

  await db.update(projects).set({ customTemplate: templateKey }).where(eq(projects.id, row.id));
  console.log(`✓ "${titre}" affiche désormais le rendu sur-mesure "${templateKey}".`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
