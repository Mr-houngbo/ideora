import { z } from "zod";
import { isDayString } from "@/lib/idea-dates";

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
  accent_theme: z.string().nullable().default(null),
  est_espace_travail: z.boolean().default(false),
  prochaine_etape: z.string().trim().default(""),
  prochaine_etape_date: z.string().refine(isDayString, "Date invalide").nullable().default(null),
  a_la_une: z.boolean().default(false),
  // The day the idea came. Optional so older clients and scripts keep working;
  // when absent, a new project is dated now and an edit keeps its date.
  date_idee: z
    .string()
    .refine(isDayString, "Date invalide")
    .refine((d) => d <= new Date(Date.now() + 86_400_000).toISOString().slice(0, 10), "La date ne peut pas être dans le futur")
    .optional(),
});

export type ProjectFormValues = z.infer<typeof projectFormSchema>;
