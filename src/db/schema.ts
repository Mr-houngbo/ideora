import { pgTable, uuid, text, boolean, timestamp, jsonb, date, index } from "drizzle-orm/pg-core";
import type { WorkspaceStore } from "@/types/workspace";

export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  titre: text("titre").notNull(),
  categorie: text("categorie"),
  descriptionCourte: text("description_courte"),
  descriptionDetaillee: text("description_detaillee"),
  statut: text("statut").notNull().default("idee"),
  horizonTemps: text("horizon_temps").notNull().default("moyen_terme"),
  tags: text("tags").array().notNull().default([]),
  motivation: text("motivation"),
  ressources: text("ressources"),
  dateCreation: timestamp("date_creation", { withTimezone: true }).notNull().defaultNow(),
  imageData: text("image_data"), // base64-encoded image bytes, stored in Postgres — no external storage service
  imageMimeType: text("image_mime_type"),
  contenuRiche: text("contenu_riche"), // optional Markdown body, rendered on the project detail page
  accentTheme: text("accent_theme"), // key into ACCENT_THEMES, styles the rich content rendering
  customTemplate: text("custom_template"), // key into SHOWCASE_TEMPLATES; a hand-built React page replaces the generic detail view when set
  estEspaceTravail: boolean("est_espace_travail").notNull().default(false), // unlocks the linked workspace tool
  workspaceData: jsonb("workspace_data").$type<WorkspaceStore>(),
  prochaineEtape: text("prochaine_etape"), // the next concrete action
  prochaineEtapeDate: date("prochaine_etape_date"), // optional target day, YYYY-MM-DD
  aLaUne: boolean("a_la_une").notNull().default(false), // picked by hand for the home page "À la une"
  misAJourLe: timestamp("mis_a_jour_le", { withTimezone: true }).notNull().defaultNow(),
});

/**
 * Dated events in a project's life: notes, milestones, status changes and
 * promises to the future self. Together they continue the line of thought
 * that starts with the idea's own date.
 */
export const journal = pgTable(
  "journal",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    type: text("type").notNull(), // note | jalon | statut | promesse
    titre: text("titre").notNull(),
    contenu: text("contenu"),
    datePrevue: date("date_prevue"), // jalon: target day; promesse: day to read it again
    faitLe: timestamp("fait_le", { withTimezone: true }), // jalon reached / promesse read again
    ecritLe: timestamp("ecrit_le", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("journal_project_idx").on(t.projectId, t.ecritLe)],
);

export type ProjectRow = typeof projects.$inferSelect;
export type NewProjectRow = typeof projects.$inferInsert;
export type JournalRow = typeof journal.$inferSelect;
