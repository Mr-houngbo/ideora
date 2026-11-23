/**
 * Additive, idempotent schema changes, run before every build (`npm run
 * build`) so a deployment never serves code ahead of its database. Every
 * statement only adds (IF NOT EXISTS); none rewrites or drops data.
 * Skipped when DATABASE_URL is not set (local builds).
 */
import { neon } from "@neondatabase/serverless";

const STATEMENTS = [
  // Lot 4: next step, hand-picked "À la une", last update, and the journal.
  `ALTER TABLE projects ADD COLUMN IF NOT EXISTS prochaine_etape text`,
  `ALTER TABLE projects ADD COLUMN IF NOT EXISTS prochaine_etape_date date`,
  `ALTER TABLE projects ADD COLUMN IF NOT EXISTS a_la_une boolean NOT NULL DEFAULT false`,
  `ALTER TABLE projects ADD COLUMN IF NOT EXISTS mis_a_jour_le timestamptz NOT NULL DEFAULT now()`,
  `CREATE TABLE IF NOT EXISTS journal (
     id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
     project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
     type text NOT NULL,
     titre text NOT NULL,
     contenu text,
     date_prevue date,
     fait_le timestamptz,
     ecrit_le timestamptz NOT NULL DEFAULT now()
   )`,
  `CREATE INDEX IF NOT EXISTS journal_project_idx ON journal (project_id, ecrit_le)`,
  // Lot 5: links between ideas, private share links, portfolio selection.
  `ALTER TABLE projects ADD COLUMN IF NOT EXISTS dans_portfolio boolean NOT NULL DEFAULT false`,
  `CREATE TABLE IF NOT EXISTS liens (
     id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
     source_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
     cible_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
     type text NOT NULL,
     note text,
     cree_le timestamptz NOT NULL DEFAULT now()
   )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS liens_pair_idx ON liens (source_id, cible_id)`,
  `CREATE TABLE IF NOT EXISTS partages (
     id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
     token text NOT NULL UNIQUE,
     project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
     libelle text,
     cree_le timestamptz NOT NULL DEFAULT now(),
     expire_le timestamptz,
     revoque_le timestamptz,
     vues integer NOT NULL DEFAULT 0
   )`,
];

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.log("[migrate] DATABASE_URL not set, skipping.");
    return;
  }
  const sql = neon(url);
  for (const statement of STATEMENTS) {
    await sql.query(statement);
  }
  console.log(`[migrate] ${STATEMENTS.length} statements applied (all idempotent).`);
}

main().catch((error) => {
  console.error("[migrate] failed:", error);
  process.exit(1);
});
