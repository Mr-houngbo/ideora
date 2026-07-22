/**
 * One-off seed: creates real `projects` rows for the five ideas that used to
 * live as hardcoded, disconnected "showcase" pages (Daho, Houefa, Perseus,
 * Vision Éducation, MonPays+). Their substantial content is preserved here as
 * Markdown, stored in `contenu_riche`. MonPays+ additionally gets
 * `est_espace_travail = true` so it opens the workspace tool instead of
 * static text, seeded with the default (empty) domains.
 *
 * Usage: npx tsx scripts/seed-showcase-projects.ts
 */
import "dotenv/config";
import { readFileSync, unlinkSync, existsSync } from "node:fs";
import path from "node:path";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { projects } from "../src/db/schema";
import { emptyWorkspaceStore } from "../src/types/workspace";

const DATABASE_URL = requireEnv("DATABASE_URL");

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}. Copy .env.example to .env and fill it in.`);
  }
  return value;
}

const sql = neon(DATABASE_URL);
const db = drizzle(sql);

const HOUEFA_IMAGE_PATH = path.join(__dirname, "..", "public", "houefa-hero.jpg");

const dahoContent = `# DAHO

## Hero
**DAHO**
Former les géants de demain

Un programme intensif de formation tech pour les enfants du Bénin — IA, Coding, IoT, Design.

> « Daho » = Grand en Fon

## La Vision

### Le constat
Les élèves asiatiques sont très en avance sur les africains par manque d'éducation et de moyens. L'accès à une éducation tech de haut niveau reste réservé aux familles aisées. Nos enfants démarrent la course avec un handicap structurel.

### Notre ambition
Rétablir les chances dès le bas âge. Créer la prochaine génération d'innovateurs béninois capables de penser, créer et bâtir avec la technologie. Commencer par Porto-Novo — mon village — et scaler à tout le Bénin.

> « Je dois rehausser le niveau de mes frères et sœurs du village. »

## Le Modèle
Un boot camp intensif de 4 semaines, une communauté pour la vie.

### Sélection par le mérite
- Établissements publics ciblés (quartiers populaires)
- Épreuve unique pour tous les candidats
- 100 meilleurs sélectionnés (CM2, 6ème, 5ème)
- Gratuit à 100% pour les enfants

### 4 semaines immersives
- S1-3 : École quotidienne (IA, Coding, IoT, Design, Géopolitique tech)
- S4 : Immersion totale (hébergement, projet final, jury)
- 10 jeunes formateurs encadrés par 5 mentors
- Modèle "train-the-trainers" pour scalabilité

### Communauté Daho
- Accompagnement jusqu'au Bac (et au-delà)
- Plateforme e-learning permanente
- Parrainage alumni → nouveaux participants
- Challenges mensuels, rencontres trimestrielles

## Le Programme
Tous les participants suivent le même parcours intégral — la vie n'a pas de tranches d'âge.

### SEMAINE 1 — Alphabétisation numérique & IA
Qu'est-ce qu'un algorithme ? Comment l'IA transforme le monde. Tests de personnalité, mindset, objectifs personnels.
**Livrable :** Carte mentale "Moi et la tech en 2030"

### SEMAINE 2 — Coding & Programmation
Scratch ou Python selon niveau. Logique, variables, boucles, conditions.
**Livrable :** Petit jeu interactif ou chatbot simple

### SEMAINE 3 — IoT, Électronique & Design
Arduino : capteurs, LEDs, moteurs. UI/UX basique, storytelling, pitch. Géopolitique de la tech.
**Livrable :** Prototype fonctionnel (alarme, station météo, robot)

### SEMAINE 4 — Immersion & Réalisation
Hébergement complet. Groupes de 5 enfants, projet dans 1 domaine au choix. Présentation devant jury.
**Livrable :** Pitch de 3 min + slides + certificat

## Phase Pilote — Porto-Novo 2028

### Chiffres clés
- **100** Enfants formés
- **10** Formateurs
- **5** Mentors / experts
- **4** Semaines intensives

### Roadmap préparation
- **Janvier** : Constitution comité, association, négos partenaires
- **Février** : Finalisation partenariats (mairie, MTN, hôtel)
- **Mars** : Information établissements, lancement plateforme
- **Avril-Mai** : Recrutement formateurs, curriculum, supports
- **Juin** : Sélection, annonce 100 sélectionnés, formation formateurs
- **Juil.-Août** : Boot camp !

### Partenaires recherchés
Mairie de Porto-Novo | MTN Benin | Moov / Celtis | Ministère de l'Éducation | Vendeurs d'ordinateurs | Hôtels | Restaurants

## Budget Pilote
Estimation phase pilote Porto-Novo 2028 (scénario internat négocié).

| Poste | Détail | Montant (FCFA) |
|---|---|---|
| Nourriture S1–3 | 100 enfants × 1500/j × 18j | 2 700 000 |
| Nourriture S4 immersion | 115 pers. × 3000/j × 7j | 2 415 000 |
| Formation formateurs | 10 formateurs logés/nourris 2 sem. | 420 000 |
| Mentors / experts | 5 mentors × 100k | 500 000 |
| Kits IoT | 20 kits Arduino × 15k | 300 000 |
| Supports pédagogiques | Impression, badges, certificats | 200 000 |
| Kits ressources | 100 kits (livres, USB) × 5k | 500 000 |
| Laptops (meilleurs) | 5 laptops × 150k | 750 000 |
| Box wifi 1 an | 20 box × 50k | 1 000 000 |
| Communication | Flyers, médias, réseaux sociaux | 300 000 |
| Plateforme e-learning | Développement | 500 000 |
| Épreuve de sélection | Impression, correction | 100 000 |
| Imprévus | 10% du total | 1 150 000 |
| **TOTAL** | | **~11 500 000** |

**Porteur de projet :** 2M FCFA | **Partenaires à mobiliser :** ~9,5M FCFA

## Impact Attendu

### Court terme — 2028 : Pilote
- 100 enfants initiés au code, IA, IoT
- 20+ prototypes fonctionnels créés
- Taux de complétion >80%
- Communauté Daho lancée

### Moyen terme — 2029-2030 : Scale
- Déploiement Cotonou + Parakou
- 300+ enfants formés cumulés
- Modèle économique pérenne validé
- Partenariats institutionnels solides

### Long terme — 2035+ : Vision
- Couverture nationale (12 départements)
- 5000+ alumni actifs
- Premiers Daho en école d'ingé / startups
- Modèle répliqué en Afrique francophone

## Plateforme Technologique
Le cœur digital du programme — budget dev 500k FCFA.

### Fonctionnalités
- Espace curricula (cours, exercices, ressources vidéo)
- Parcours formation continue (alumni)
- Gestion privée des alumni (suivi individuel)
- Espace communauté (forum, challenges, parrainage)
- Vitrine publique (éditions, photos, témoignages)
- Back-office gestion éditions (inscriptions, planning)

### Stack technique
- **Frontend** : WordPress + thème custom
- **LMS** : LearnDash (espace formation)
- **Communauté** : BuddyPress + bbPress
- **Gestion** : Custom Post Types + ACF Pro
- **Hébergement** : OVH VPS (50k/an)

**Budget total : 500k FCFA**

## Stratégie de Déploiement

### PHASE 1 — 2028 : Pilote Porto-Novo
- 100 enfants
- Validation du modèle
- Métriques de référence
- Capitalisation retours

### PHASE 2 — 2029 : Expansion Cotonou
- Porto-Novo édition 2 (100)
- Cotonou édition 1 (100)
- 200 enfants cumulés
- Structuration association

### PHASE 3 — 2030 : 3 Villes Simultanées
- Porto-Novo édition 3
- Cotonou édition 2
- Parakou édition 1
- 300 enfants/an
- Recherche financement scale national

## Structure & Gouvernance

### Statut juridique
- **Forme** : Association loi 1901 (équivalent béninois)
- **Nom légal** : Association Daho
- **Siège** : Porto-Novo
- **Création** : Janvier 2028

### Comité de pilotage
- **Président** — Vision stratégique, fundraising, représentation
- **Directeur Pédagogique** — Curriculum, formateurs, qualité
- **Directeur Logistique** — Partenariats, infrastructure
- **Trésorier** — Budget, comptabilité, reporting
- **Resp. Communauté** — Alumni, plateforme, suivi

## Rejoignez le mouvement
Partenaire, mentor, sponsor, bénévole — chaque contribution compte pour former les géants de demain.

Contact : contact@daho.bj

## Footer
« Daho » — Grand en Fon | Former les géants de demain
© 2028 Association Daho. Tous droits réservés.
`;

const houefaContent = `# HOUEFA (Projet Houefa)

## Hero
**HOUEFA**

> « Maison paisible, apaisée et apaisante »

Plus qu'un toit, un écosystème pour ta réussite

Statut : Phase de conceptualisation
Countdown vers l'ouverture cible : **Septembre 2029**

## 01 · Vision & Identité
- **Fondateur** : Calixte
- **Horizon** : 5 ans (2025-2029)
- **Ouverture cible** : Sept 2029
- **Phase actuelle** : Phase 1 — Conceptualisation

> "Je ne construis pas une résidence, je construis des destins."
> — Calixte, Fondateur

## 02 · Qu'est-ce que Houefa ?

### Trois dimensions
- **Hébergement** — Logements modernes, meublés, tout inclus
- **Technologie** — SuperApp, identité numérique, paiements
- **Formation** — Accès plateformes, mentorat, bootcamps

### Description
**Houefa** est un concept de résidences étudiantes intelligentes de nouvelle génération au Bénin. Plus qu'un simple logement, c'est un écosystème complet qui combine hébergement moderne, technologie de pointe, formation continue et communauté d'excellence — le tout accessible via un loyer mensuel unique all-inclusive.

Ce qui distingue Houefa, c'est son approche holistique : une **SuperApp intégrée** centralise l'identité numérique de chaque résident, ses paiements, l'accès aux services et aux opportunités.

**Vision 5-10 ans :** 20-30 résidences en Afrique de l'Ouest, LA référence pour le logement étudiant africain.

## 03 · Pourquoi ce projet

### Le problème
Le logement étudiant en Afrique — et à l'UAC en particulier — est catastrophique. Des étudiants brillants échouent non pas par manque de talent, mais parce que leurs conditions de vie les empêchent de se concentrer. Pas d'électricité stable, pas d'eau courante, pas d'internet.

### L'impact visé
Former une nouvelle génération de talents africains en leur donnant l'égalité des chances. Prouver qu'un modèle d'excellence accessible est viable. Créer les leaders de demain.

> « J'ai fait l'UAC. J'ai vu de mes propres yeux comment l'environnement influence massivement les résultats des étudiants. Si on supprime les soucis de nourriture, d'électricité, d'eau, de loyer — si on libère l'étudiant de ces fardeaux — il peut se consacrer à apprendre, à grandir, à innover. Houefa, c'est la résidence que j'aurais voulu avoir. »
> — Calixte

## 04 · Où et pour qui

### Localisation Phase 1
- **Bénin** — Abomey-Calavi
- **Proximité :** Université d'Abomey-Calavi (UAC)
- **Quartiers :** Godomey, Akassato, Tankpè
- 60 000+ étudiants, marché quasi-vierge

### Public cible
Étudiants UAC (Licence, Master) + universités de la zone
- 40% modestes / 40% classe moyenne / 20% aisés
- 25-50k FCFA tout compris vs 45-55k pour conditions médiocres

## 05 · Les 4 Piliers

### PILIER 01 — Infrastructure Physique
**45 unités / 100 places :**
- 10 Studios Solo (15m²) — 50 000 FCFA
- 20 T2 Duo (30m²) — 75 000 FCFA
- 10 T3 Trio (40m²) — 90 000 FCFA
- 5 T4 Coloc (50m²) — 100 000 FCFA

**Inclus :** Meublé, électricité, eau, clim, internet fibré

### PILIER 02 — Écosystème Numérique
**SuperApp Houefa :**
- Identité numérique & carte résident
- Paiements Mobile Money intégrés
- Réservation espaces & signalements
- Job board, events, formations
- Messagerie & communauté par filière

**Accès :** JSTOR, Coursera, edX, Microsoft 365, GitHub

### PILIER 03 — Services & Bien-être
- Restaurant subventionné à prix étudiants
- Infirmerie / Point santé
- Vélos électriques en location
- WiFi gratuit partout

**Programmation :** Conférences, ateliers CV/pitch, bootcamps tech, networking

### PILIER 04 — Impact & Mission Sociale
- 40% logements à tarif accessible (25-30k FCFA)
- Sélection sur potentiel, pas les moyens
- Bourses pour étudiants d'excellence modestes
- Mentorat croisé (aisés ↔ modestes)
- Réseau alumni

**Partenariats :** UAC, entreprises sponsors, fondations

## 06 · Modèle Économique

### Revenus An 1 (100 étudiants)
| Type | Unités | Prix/mois | Total |
|---|---|---|---|
| Studios Solo | 10 | 50 000 | 500 000 |
| T2 Duo | 20 | 75 000 | 1 500 000 |
| T3 Trio | 10 | 90 000 | 900 000 |
| T4 Coloc | 5 | 100 000 | 500 000 |
| **TOTAL MENSUEL** | **45** | | **3 400 000 FCFA** |

- **Revenus loyers/an :** 40.8M FCFA
- **Revenus totaux/an :** 46.7M FCFA (~80k$)
- **Profit Net An 1 :** 14.2M FCFA — ✅ Rentable dès An 1

### Charges An 1 — 32.5M FCFA
- Personnel (8 postes) : 10.2M (31%)
- Opérations (maintenance, resto...) : 11.8M (36%)
- Utilités (élec, eau, internet) : 5.7M (18%)
- Numérique (apps, licences) : 4.8M (15%)

## 07 · Roadmap (5 ans)

### 2025-2026 — Préparation
- Structure juridique SARL
- Constitution équipe associés
- Étude de marché UAC
- Identification terrain
- Plans architecturaux
- Mobiliser 100-150M FCFA

### 2027 — Mobilisation & Lancement Travaux
- Achat terrain (20M FCFA)
- Mobilisation 300-500M FCFA
- Permis de construire
- Lancement chantier
- Début dev SuperApp

### 2028 — Construction & Marketing
- Achever construction (18 mois)
- Finaliser SuperApp
- Campagne marketing UAC
- Recrutement personnel
- Pré-réservations 70%

### 2029 — 🎉 Ouverture !
- Inauguration Août 2029
- Emménagement 1ère cohorte Sept
- 100% occupation en 6 mois
- Ajustements modèle

### 2030+ — Expansion
- Résidence 2 (autre ville)
- Levée de fonds 1-2 milliards FCFA
- Professionnaliser l'équipe
- Référence Afrique de l'Ouest

## 08 · L'Équipe
- **Calixte** — Fondateur & Gérant Majoritaire (60-70%) : Vision & stratégie, gestion opérationnelle, relations investisseurs
- **Associé 1** — Directeur Financier (10-15%) : Comptabilité, finance, trésorerie
- **Associé 2** — Directeur Tech (10-15%) : Dev SuperApp, infrastructure IT, sécurité
- **Associé 3** — Directeur Marketing & Ops (5-10%) : Remplissage résidence, communication, opérations

### Protections juridiques
- Clause rachat parts (valeur marché +20%)
- Droit de veto sur décisions stratégiques
- Clause non-concurrence (5 ans)
- Gérance majoritaire pour le fondateur

## 09 · Budget & Levée de Fonds

### Investissement Initial Total
| Poste | FCFA |
|---|---|
| Terrain (1-2 hectares) | 20M |
| Construction | 285M |
| Équipements & Mobilier | 68M |
| Infrastructure technique | 50M |
| Développement SuperApp | 15M |
| Frais admin & légaux | 13M |
| Fonds de roulement (6 mois) | 10M |
| Buffer imprévus (10%) | 46M |
| **TOTAL** | **~507M FCFA (~866k$)** |

### Mobilisation par phase
- **An 1 (2025) :** 100M — Apports personnels + associés + famille
- **An 2 (2026) :** 200M — Épargne + prêt bancaire + investisseurs
- **An 3 (2027) :** 250M — Prêt principal + fondations + diaspora

**Objectif sécurité :** 550M FCFA (~940k$)
**Option MVP :** 300M FCFA (~510k$) — 50 étudiants, 25 logements

## 10 · Indicateurs de Succès (KPIs)

### Financiers
- Taux d'occupation : 90%+
- Revenus mensuels : 3.4M+ FCFA
- Rentabilité opérationnelle dès An 1
- Marge nette : 30%+

### Satisfaction
- NPS : 50+
- Rétention An 2 : 70%+
- Satisfaction : 4.2/5+
- SuperApp : 80%+ actifs mensuels

### Impact Académique
- Taux réussite > moyenne UAC
- Bourses obtenues : 20+ étudiants
- Startups lancées : 5+

### Communauté
- Événements : 24+/an
- Participation : 40%+
- Partenariats actifs : 10+

## 11 · Identité Visuelle

### Taglines
- "Plus qu'un toit, un écosystème pour ta réussite"
- "Là où l'excellence devient accessible"
- "Ton campus, ta communauté, ton avenir"

### Palette Couleurs
- Vert — Croissance & nature
- Bleu — Innovation & confiance
- Orange — Jeunesse & énergie

### Valeurs
Excellence accessible, Innovation, Communauté, Impact, Durabilité

## 12 · Risques & Mitigation
- **Difficulté de financement** (Prob: Moyenne-Haute, Impact: Critique) — Commencer par MVP (50 étudiants) ; Diversifier sources de fonds ; Pilote en louant un immeuble existant
- **Faible occupation initiale** (Prob: Moyenne, Impact: Élevé) — Marketing intense 6 mois avant ; Partenariats UAC ; Offres early-bird
- **Retards construction** (Prob: Haute, Impact: Moyen-Élevé) — Entreprise fiable + visites chantier ; Pénalités retard au contrat ; Buffer 3-6 mois
- **Problèmes techniques** (Prob: Moyenne, Impact: Élevé) — Sur-dimensionner infrastructure ; Panneaux solaires backup ; Double connexion internet
- **Conflits associés** (Prob: Moyenne, Impact: Critique) — Pacte associés très clair ; Rôles définis précisément ; Clause sortie/rachat anticipée
- **Copycats** (Prob: Haute si succès, Impact: Moyen) — First-mover advantage ; SuperApp = barrière à l'entrée ; Scale rapidement

## 13 · Ressources

### Documents clés
Business plan détaillé, Pitch deck investisseurs, Étude de marché UAC, Plans architecturaux, Cahier des charges SuperApp, Modèle financier, Pacte associés

### Inspirations
Roam (Co-living global), Common (Co-living USA), WeWork (modèle espace partagé), Studesk / Studélites (résidences Europe), Andela (écosystème tech africain)

## 14 · Mes 90 Prochains Jours

### Semaines 1-4 : Fondations
- Rédiger pacte associés (avec avocat)
- Créer SARL au Bénin
- Ouvrir compte bancaire entreprise
- Finaliser business plan v1.0
- Étude marché terrain UAC (50+ étudiants interrogés)

### Semaines 5-8 : Validation
- Identifier 3-5 terrains potentiels Calavi
- Visiter terrains avec associés
- Rencontrer 2-3 architectes
- Affiner projections financières
- Créer pitch deck v1.0

### Semaines 9-12 : Mobilisation
- Commencer mobilisation apports personnels
- Réunions investisseurs potentiels
- Pré-négocier terrain préféré
- Lancer brainstorm branding
- Commencer cahier des charges SuperApp

## 15 · Pourquoi je me lève chaque matin

> "Je ne construis pas une résidence, je construis des destins."

1. Parce que j'ai vu trop d'étudiants brillants échouer à cause de mauvaises conditions de vie.
2. Parce que je crois que l'égalité des chances commence par un environnement propice à la réussite.
3. Parce que je veux prouver qu'on peut être rentable ET avoir un impact social massif.

## Footer
Dernière mise à jour : Février 2026 · Version 2.0
*Projet confidentiel — Ne pas diffuser sans autorisation*
`;

const perseusContent = `# PERSEUS

## Hero
**Club Privé · Fondé 2025**

# PERSEUS

> « Couper la tête de Méduse — vaincre l'ignorance financière. »

Un cercle fermé d'éducation financière et d'investissement. Nous lisons, nous débattons, nous capitalisons. Ensemble, nous bâtissons des fortunes patientes et une mémoire commune.

*En hommage à mon petit frère*

## I · Le Serment (Manifesto)

> « Nous ne sommes pas des spéculateurs.
> Nous sommes des **bâtisseurs patients**.
> Nous lisons ce que la foule ignore.
> Nous capitalisons quand la foule consomme.
> Nous construisons une fortune qui survit à nos noms. »

— LE CERCLE PERSEUS —

## II · Les Trois Piliers — Vision · Mission · But

### Vision
Devenir le cercle de référence d'investisseurs africains éclairés — patients, disciplinés, redoutables.

### Mission
Bâtir un capital intellectuel et financier commun par la lecture, le débat et l'investissement collectif.

### But
Atteindre, en dix ans, une masse critique qui nous permette de diriger des projets, des entreprises, une économie.

## III · Le Conseil — Les Cinq Postes
*Évolutifs avec la croissance du cercle.*

1. **Président** — « Le Fondateur » — Garde la vision, tranche en dernier ressort.
2. **Trésorier Général** — « Le Gardien des Coffres » — Garde le capital, tient la comptabilité, signe les mouvements.
3. **Secrétaire Général** — « La Voix du Cercle » — Organise les réunions hebdomadaires, tient l'ordre du jour.
4. **Archives & Mémoire** — « Le Chroniqueur » — Conserve les procès-verbaux, les décisions, les lectures.
5. **Avocat du Club** — « Le Juriste » — Veille au respect des règles, encadre les sorties et conflits.

## IV · La Trajectoire — Dix Années

### 6 MOIS — Le Fondement
Statuts, règlement intérieur, première bibliothèque commune. 12 livres lus, 4 certifications visées.

### 1 AN — L'Éducation
Maîtrise de la bourse, de l'économie africaine et mondiale. Chaque membre dispose d'un plan d'investissement à 10 ans.

### 3 ANS — Le Capital
Cotisations régulières, portefeuille collectif diversifié. Premiers investissements dans des entreprises ciblées.

### 10 ANS — L'Empire
Locaux, investissements dans les projets de nos membres contre des parts. Influence sur une économie entière.

## V · Les Rituels — Le Travail du Cercle

1. **Lecture obligatoire** — Un livre par mois. Résumé écrit avant la réunion suivante.
2. **Débat hebdomadaire** — Une heure de discussion sur un thème : macro, micro, géopolitique, valeur.
3. **Suivi des plans** — Chaque membre présente l'avancement de son plan d'investissement personnel.
4. **Cotisation collective** — Versement mensuel au trésor commun pour les positions du cercle.
5. **Formation & certification** — CFA, AMF, Bloomberg, finance comportementale — niveau imposé.
6. **Veille partagée** — Chaque membre alimente la mémoire commune : signaux, opportunités, risques.

## VI · Le Code — Commandements & Interdits

### Les Devoirs
- Lire, débattre, écouter sans interrompre.
- Verser sa cotisation à date fixe, sans rappel.
- Présenter ses pertes avec la même clarté que ses gains.
- Parrainer une seule personne par an, et s'en porter garant.
- Élever le niveau du cercle, jamais le tirer vers le bas.

### Les Interdits
- Trahir le secret des décisions internes.
- Spéculer avec le capital commun sans vote.
- Mentir sur ses chiffres ou son avancement.
- Faire entrer un inconnu sans parrainage validé.
- Utiliser le cercle pour un intérêt strictement personnel.

## VII · La Porte — Entrer · Sortir

### Parrainage
1. Un seul filleul par membre, par an.
2. Le parrain se porte garant moralement et financièrement.
3. Période d'observation de 3 mois avant vote final.
4. Vote à l'unanimité du conseil pour l'admission.
5. Faute grave du filleul = exclusion du parrain.

### Sortie Propre
1. Restitution de la quote-part au prix de marché.
2. Délai de remboursement fixé à 90 jours maximum.
3. Clause de confidentialité maintenue à vie.
4. Aucun impact sur les positions du cercle restant.
5. Sortie volontaire ou exclusion : même procédure.

## VIII · La Mesure — Les Chiffres du Cercle
- **12** — Livres / an / membre
- **52** — Réunions par an
- **10 ans** — Horizon stratégique
- **1 filleul** — Par membre par an

## Dédicace — En hommage à PERSEUS

> « Ce cercle porte ton nom.
> Chaque livre lu, chaque décision prise, chaque fortune bâtie
> sera une lettre écrite à ta mémoire. »

## Footer
Cercle Perseus · MMXXV · Sub Rosa
`;

const visionEducationContent = `# VISION ÉDUCATION

## Hero
**Manifeste · Plan 20 ans**

# Je vais changer l'éducation au Bénin.

Compteur : depuis le 1er mars 2025, sur un horizon de 7 300 jours (20 ans).

> "L'éducation est l'arme la plus puissante qu'on puisse utiliser pour changer le monde."
> — Nelson Mandela

## Le diagnostic
### Pourquoi le système béninois échoue.

- **70%** des diplômés sans emploi adéquat
- **2/10** élèves maîtrisent les compétences de base en fin de primaire
- **45%** de fuite des cerveaux parmi les diplômés du supérieur

## La vision — Trois piliers. Un même objectif.
Prouver qu'une autre éducation est possible au Bénin — et la construire.

### 01 · Le documentaire — CRÉER L'ÉMOTION
Un film vu partout en Afrique, qui montre la réalité et inspire le changement. L'émotion comme moteur de la viralité.

### 02 · Le livre — DONNER LA PROFONDEUR
Un manifeste qui propose un nouveau modèle éducatif, ancré dans les réalités béninoises et nourri des meilleures pratiques mondiales.

### 03 · Le groupe scolaire — PROUVER PAR L'ACTION
Une école qui prouve que c'est possible. Des résultats mesurables. Une preuve vivante que le modèle fonctionne.

## La feuille de route — Le plan sur 20 ans.
Chaque phase nourrit la suivante — la recherche légitime le livre, le livre légitime l'école, l'école légitime la réforme.

### Phase 1 — Fondations (Années 1–3) — *Étudiant chercheur* — En cours
C'est maintenant. Vous êtes étudiant, c'est votre avantage. Lisez de manière obsessionnelle. Écrivez publiquement. Construisez votre communauté avant même d'avoir un produit.
- Rapports PISA, réformes finlandaise et singapourienne
- John Dewey, Ken Robinson, Paulo Freire
- Blog, LinkedIn, X — poser votre voix

### Phase 2 — Création (Années 3–7) — *Auteur & cinéaste*
Le documentaire et le livre sortent ensemble. Le livre donne la profondeur intellectuelle, le documentaire donne l'émotion et la viralité. L'un sans l'autre est incomplet.
- Identifier les familles à suivre dès maintenant
- Rédiger le manifeste en FR + EN
- Viser Netflix Africa, coproducteurs, ONG

### Phase 3 — Expérimentation (Années 7–13) — *Fondateur*
Une école pilote transforme votre discours en réalité. Sans elle, vous restez un théoricien. Avec elle, vous devenez un praticien crédible.
- 1 école primaire selon votre modèle
- Mesurer, documenter, ajuster chaque année
- Publier des résultats vs système classique

### Phase 4 — Impact systémique (Années 13–20) — *Réformateur*
Si les résultats sont là, le système vient à vous. Vous n'avez plus à convaincre — vous montrez.
- Franchise / open-source du modèle
- Collaboration avec le Ministère
- Formation de la prochaine génération

## Le fuel personnel — Ce qui me pousse.
- Je ne viens pas d'un milieu qui m'a *tout donné*.
- Je viens d'un pays où des millions d'enfants brillants sont *éteints* par un système qui ne sait pas les voir.
- Je refuse d'accepter que le lieu de naissance détermine *le plafond d'un esprit*.
- Je ne fais pas ça pour être célèbre. Je fais ça parce que *quelqu'un doit le faire*.
- Chaque jour que je travaille sur ce projet est un jour *volé au statu quo*.

## Footer
Créé le 1er mars 2025

Ce projet n'appartient pas au futur.
**Il commence aujourd'hui.**
`;

const monPaysPlusContent = `# MONPAYS+

Observer le monde, construire le Bénin. Un espace de travail pour documenter des initiatives observées ailleurs dans le monde, évaluer leur adaptabilité au contexte béninois, cartographier un réseau de contacts utiles, et suivre une feuille de route sur plusieurs années — bibliothèque de ressources et journal de réflexion inclus.

Ouvrir l'espace de travail ci-dessous pour commencer à documenter des initiatives par domaine (Éducation, Santé, Économie, Agriculture, Gouvernance, Infrastructure, Culture & Identité).
`;

interface ShowcaseProject {
  titre: string;
  categorie: string;
  descriptionCourte: string;
  descriptionDetaillee?: string;
  motivation?: string;
  contenuRiche: string;
  accentTheme: string;
  tags: string[];
  estEspaceTravail?: boolean;
  imagePath?: string;
}

const showcaseProjects: ShowcaseProject[] = [
  {
    titre: "Daho",
    categorie: "Social",
    descriptionCourte: "Former les géants de demain — un bootcamp tech intensif pour les enfants du Bénin.",
    motivation: "Je dois rehausser le niveau de mes frères et sœurs du village.",
    contenuRiche: dahoContent,
    accentTheme: "orange",
    tags: ["Éducation", "IA", "Bootcamp", "Bénin"],
  },
  {
    titre: "Houefa",
    categorie: "Business",
    descriptionCourte: "Résidences étudiantes intelligentes de nouvelle génération au Bénin — ouverture cible septembre 2029.",
    motivation: "Je ne construis pas une résidence, je construis des destins.",
    contenuRiche: houefaContent,
    accentTheme: "emeraude",
    tags: ["Immobilier", "SuperApp", "Éducation", "Bénin"],
    imagePath: HOUEFA_IMAGE_PATH,
  },
  {
    titre: "Perseus",
    categorie: "Personnel",
    descriptionCourte: "Cercle privé d'éducation financière et d'investissement, fondé en 2025.",
    motivation: "En hommage à mon petit frère.",
    contenuRiche: perseusContent,
    accentTheme: "or",
    tags: ["Finance", "Investissement", "Club privé"],
  },
  {
    titre: "Vision Éducation",
    categorie: "Social",
    descriptionCourte: "Je vais changer l'éducation au Bénin — manifeste et plan sur 20 ans.",
    contenuRiche: visionEducationContent,
    accentTheme: "bleu",
    tags: ["Éducation", "Documentaire", "Livre", "Réforme"],
  },
  {
    titre: "MonPays+",
    categorie: "Social",
    descriptionCourte: "Observer le monde, construire le Bénin — espace de travail pour cartographier des initiatives adaptables.",
    contenuRiche: monPaysPlusContent,
    accentTheme: "emeraude",
    tags: ["Bénin", "Veille", "Initiatives"],
    estEspaceTravail: true,
  },
];

async function main() {
  for (const item of showcaseProjects) {
    let imageData: string | null = null;
    let imageMimeType: string | null = null;

    if (item.imagePath && existsSync(item.imagePath)) {
      const buffer = readFileSync(item.imagePath);
      imageData = buffer.toString("base64");
      imageMimeType = "image/jpeg";
    }

    await db.insert(projects).values({
      titre: item.titre,
      categorie: item.categorie,
      descriptionCourte: item.descriptionCourte,
      descriptionDetaillee: item.descriptionDetaillee ?? null,
      statut: "en_cours",
      horizonTemps: "long_terme",
      tags: item.tags,
      motivation: item.motivation ?? null,
      contenuRiche: item.contenuRiche,
      accentTheme: item.accentTheme,
      estEspaceTravail: item.estEspaceTravail ?? false,
      workspaceData: item.estEspaceTravail ? emptyWorkspaceStore : null,
      imageData,
      imageMimeType,
    });

    console.log(`  ✓ ${item.titre}`);
  }

  console.log("\nDone. 5 projects created.");

  if (existsSync(HOUEFA_IMAGE_PATH)) {
    unlinkSync(HOUEFA_IMAGE_PATH);
    console.log("Removed public/houefa-hero.jpg (now embedded in the Houefa project's image).");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
