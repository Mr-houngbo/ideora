import { pgTable, uuid, text, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
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
  estEspaceTravail: boolean("est_espace_travail").notNull().default(false), // unlocks the linked workspace tool
  workspaceData: jsonb("workspace_data").$type<WorkspaceStore>(),
});

export type ProjectRow = typeof projects.$inferSelect;
export type NewProjectRow = typeof projects.$inferInsert;
