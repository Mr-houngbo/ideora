# Ideora

Tracker personnel d'ambitions et de projets — business et académique — depuis 2025.

## Stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript
- [Neon](https://neon.tech) (PostgreSQL) + [Drizzle ORM](https://orm.drizzle.team)
- Session serveur signée (JWT via `jose`) + mot de passe hashé (`bcryptjs`), toutes les routes protégées via `proxy.ts`
- Images stockées en base64 directement dans Neon (aucun service de stockage tiers), servies via `/api/images/[id]`
- shadcn/ui, Tailwind CSS, Framer Motion, Zustand (filtres UI uniquement)
- [Vitest](https://vitest.dev) pour les tests

## Développement local

1. Copier `.env.example` vers `.env` (pas `.env.local` : Drizzle Kit et le script de migration ne lisent que `.env`) et renseigner les variables (voir commentaires dans le fichier).
2. Générer le hash du mot de passe admin :
   ```bash
   npx tsx scripts/hash-password.ts "mon-mot-de-passe"
   ```
   et coller le résultat dans `ADMIN_PASSWORD_HASH`.
3. Appliquer le schéma sur la base Neon :
   ```bash
   npm run db:push
   ```
4. Lancer le serveur de développement :
   ```bash
   npm run dev
   ```

## Scripts

- `npm run dev` / `npm run build` / `npm run start`
- `npm test` — tests Vitest
- `npm run db:push` / `npm run db:studio` — Drizzle
- `npm run migrate:data` — migration ponctuelle des données depuis l'ancien projet Supabase (lecture seule sur la source)
