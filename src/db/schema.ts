import { pgTable, uuid, text, boolean, timestamp } from "drizzle-orm/pg-core";

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
  estPublic: boolean("est_public").notNull().default(false),
  imageData: text("image_data"), // base64-encoded image bytes, stored in Postgres — no external storage service
  imageMimeType: text("image_mime_type"),
});

export type ProjectRow = typeof projects.$inferSelect;
export type NewProjectRow = typeof projects.$inferInsert;
