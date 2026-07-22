import { z } from "zod";

export const projectFormSchema = z.object({
  titre: z.string().trim().min(1, "Le titre est requis"),
  categorie: z.string().trim().min(1),
  description_courte: z.string().trim().default(""),
  description_detaillee: z.string().trim().default(""),
  statut: z.enum(["idee", "en_cours", "en_pause", "termine", "abandonne"]),
  horizon_temps: z.enum(["court_terme", "moyen_terme", "long_terme"]),
  tags: z.array(z.string().trim().min(1)).default([]),
  motivation: z.string().trim().default(""),
  ressources: z.string().trim().default(""),
  image_url: z.string().nullable().default(null),
  contenu_riche: z.string().trim().default(""),
  est_espace_travail: z.boolean().default(false),
});

export type ProjectFormValues = z.infer<typeof projectFormSchema>;
