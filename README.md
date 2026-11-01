# SOUMANGOUROU TECHNOLOGIE — Documentation Technique

> **Site officiel et CMS d'administration de SOUMANGOUROU TECHNOLOGIE**  
> Solutions numériques modernes inspirées de l'héritage africain.  
> Domaine de production : [https://soumangouroutechnologie.com](https://soumangouroutechnologie.com)

---

## Sommaire

1. [Stack Technique](#1-stack-technique)
2. [Arborescence du Projet](#2-arborescence-du-projet)
3. [Prérequis et Installation](#3-prérequis-et-installation)
4. [Variables d'Environnement](#4-variables-denvironnement)
5. [Base de Données et Prisma](#5-base-de-données-et-prisma)
6. [Authentification et Sécurité](#6-authentification-et-sécurité)
7. [Architecture de l'Application](#7-architecture-de-lapplication)
8. [Référence des API Routes](#8-référence-des-api-routes)
9. [Espace Administration (CMS)](#9-espace-administration-cms)
10. [Procédures de Maintenance Courante](#10-procédures-de-maintenance-courante)
11. [Déploiement en Production](#11-déploiement-en-production)
12. [Standards de Qualité et Audit de Sécurité](#12-standards-de-qualité-et-audit-de-sécurité)

---

## 1. Stack Technique

| Domaine | Technologies | Version / Détails |
|---|---|---|
| **Framework Web** | [Next.js](https://nextjs.org/) (App Router & Turbopack) | `16.4.3` |
| **Langage** | [TypeScript](https://www.typescriptlang.org/) | `^5.7.3` |
| **Style & UI** | [Tailwind CSS](https://tailwindcss.com/), Framer Motion, Lucide React | Tailwind `v3.4.17` |
| **ORM & BDD** | [Prisma](https://www.prisma.io/) + PostgreSQL ([Supabase](https://supabase.com/)) | Prisma `5.22.0` |
| **Stockage Fichiers** | Supabase Storage (Bucket `uploads`) | `@supabase/supabase-js` `^2.109.0` |
| **Éditeur Riche** | [TipTap](https://tiptap.dev/) | `^3.32.2` |
| **Sécurité & Auth** | JSON Web Tokens (`jsonwebtoken`), `bcryptjs`, Cookie HTTP-Only | Dérivation SHA-256 |
| **Validation** | [Zod](https://zod.dev/) & `react-hook-form` | Zod `^3.25.76` |

---

## 2. Arborescence du Projet

```text
├── app/
│   ├── (public)
│   │   ├── layout.tsx              # Layout racine avec polices, métadonnées SEO & JSON-LD Schema.org
│   │   ├── page.tsx                # Page d'accueil dynamique (Hero, Projets, À propos, Blog, Contact, Footer)
│   │   ├── blog/[slug]/page.tsx    # Page dynamique de lecture d'article de blog avec commentaires
│   │   ├── feed.xml/route.ts       # Flux RSS automatisé
│   │   ├── robots.ts               # Configuration robots.txt
│   │   └── sitemap.ts              # Génération dynamique sitemap.xml
│   ├── admin/                      # Espace d'administration CMS (protégé par proxy/middleware)
│   │   ├── login/page.tsx          # Page de connexion administrateur
│   │   ├── dashboard/page.tsx      # Vue globale et statistiques
│   │   ├── projects/page.tsx       # Gestion des projets au catalogue
│   │   ├── blog/page.tsx           # Rdaction et gestion des articles de blog
│   │   ├── videos/page.tsx         # Gestion des vidéos YouTube
│   │   ├── gallery/page.tsx        # Gestion de la médiathèque photo
│   │   ├── messages/page.tsx       # Messages du formulaire de contact & abonnés newsletter
│   │   └── settings/page.tsx       # Personnalisation des textes, coordonnées, menus et couleurs
│   └── api/                        # Routes d'API backend (Next.js Route Handlers)
│       ├── auth/login              # Connexion admin & émission du cookie admin_token
│       ├── auth/logout             # Déconnexion admin
│       ├── blog                    # CRUD articles de blog
│       ├── contact                 # Envoi (public) et consultation (admin) des messages
│       ├── gallery                 # CRUD images de la galerie
│       ├── newsletter              # Inscription newsletter
│       ├── projects                # CRUD projets
│       ├── settings                # Lecture et mise à jour des paramètres du site
│       ├── upload                  # Upload sécurisé de médias vers Supabase Storage
│       └── youtube                 # CRUD vidéos YouTube
├── components/
│   ├── layout/                     # Header, Footer
│   ├── sections/                   # Hero, ProjectsCarousel, AboutSection, BlogSection, ContactSection, VideosSection
│   └── ui/                         # Logo, SocialIcons
├── lib/
│   ├── auth.ts                     # Fonctions d'authentification JWT et lecture du cookie admin
│   ├── prisma.ts                   # Client Prisma singleton (évite la duplication de connexions)
│   ├── supabase.ts                 # Client Supabase pour le front / SDK
│   └── types.ts                    # Interfaces TypeScript communes
├── prisma/
│   ├── schema.prisma               # Définition des 18 modèles de la base de données
│   ├── seed.ts                     # Script de seed TypeScript (avec données initiales et compte admin)
│   └── seed.js                     # Script de seed JavaScript alternatif
├── supabase/
│   └── schema.sql                  # Schéma PostgreSQL initial avec activation et règles RLS
├── public/                         # Assets statiques (logos, images, vidéos locales)
├── proxy.ts                        # Middleware de redirection sécurisée pour /admin/*
├── vercel.json                     # Configuration de déploiement Vercel
└── package.json                    # Dépendances et scripts npm
```

---

## 3. Prérequis et Installation

### Prérequis
* **Node.js** : version `20.x` ou `22.x` (LTS recommandée)
* **npm** : version `10.x` ou supérieure
* Une instance **PostgreSQL** ou un projet **Supabase** actif

### Installation

1. Cloner le dépôt et se placer dans le dossier :
   ```bash
   git clone https://github.com/soumangouroutechnologie/soumangourou-technologie-siteweb.git
   cd soumangourou-technologie-siteweb
   ```

2. Installer les dépendances :
   ```bash
   npm install
   ```

3. Créer le fichier d'environnement local `.env` :
   ```bash
   cp .env.example .env
   ```

4. Renseigner les variables dans `.env` (voir section suivante).

5. Générer le client Prisma et synchroniser la base :
   ```bash
   npm run db:push
   npm run db:seed
   ```

6. Démarrer le serveur de développement :
   ```bash
   npm run dev
   ```
   L'application est accessible sur [http://localhost:3000](http://localhost:3000).

---

## 4. Variables d'Environnement

Le fichier `.env` doit contenir les variables suivantes :

```bash
# Connexion PostgreSQL poolée (Supabase port 6543)
DATABASE_URL="postgresql://postgres.[REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"

# Connexion directe pour migrations Prisma (Supabase port 5432)
DIRECT_URL="postgresql://postgres.[REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

# Clé secrète JWT pour la signature des sessions admin (>= 32 caractères aléatoires)
JWT_SECRET="votre_cle_jwt_tres_longue_et_aleatoire_generer_avec_openssl"

# Configuration Supabase Storage
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT_REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# URL canonique du site
NEXT_PUBLIC_SITE_URL="https://soumangouroutechnologie.com"
```

> **Astuce de génération de secret JWT** :
> ```bash
> openssl rand -base64 32
> ```

---

## 5. Base de Données et Prisma

### Les Modèles Principaux (`prisma/schema.prisma`)

* **`User`** : Comptes administrateurs (identifiants hashés avec `bcryptjs`).
* **`Settings`** : Table singleton (`id = "default"`) stockant les textes Hero, À propos, valeurs d'entreprise, coordonnées de contact, couleurs et liens de navigation.
* **`SeoSettings`** : Meta-titre, description globale, mots-clés et identifiants réseaux.
* **`Project` & `ProjectCategory`** : Projets affichés dans le carrousel interactif d'accueil.
* **`BlogPost`, `Category`, `Tag`, `Comment`** : Système de blog complet avec support TipTap, SEO spécifique, temps de lecture et commentaires modérables.
* **`Gallery` & `GalleryImage`** : Galerie multimédia et portfolio photos.
* **`YoutubeVideo` & `YoutubePlaylist`** : Vidéos intégrées.
* **`ContactMessage`** : Messages transmis via le formulaire de contact avec suivi de statut (`isRead`).
* **`NewsletterSubscriber`** : Liste des adresses emails abonnées.

### Commandes Utiles

```bash
# Régénérer le client Prisma après modification du schema.prisma
npx prisma generate

# Appliquer les modifications de schéma directement sur la base (sans migration fichier)
npm run db:push

# Créer une migration versionnée (recommandé en équipe)
npx prisma migrate dev --name nom_de_la_modification

# Réinitialiser / injecter les données de démonstration et compte admin par défaut
npm run db:seed

# Ouvrir l'interface graphique Prisma Studio
npx prisma studio
```

---

## 6. Authentification et Sécurité

### Fonctionnement de l'authentification
1. L'administrateur saisit ses identifiants sur `/admin/login`.
2. La route `POST /api/auth/login` compare le mot de passe avec le hash `bcryptjs` en base.
3. Un jeton **JWT signé** valide pendant 7 jours est créé et stocké dans un cookie `admin_token` avec les attributs :
   * `httpOnly: true` (inaccessible au JavaScript côté navigateur, protection contre le vol de session XSS)
   * `sameSite: 'lax'` (protection CSRF)
   * `secure: true` en environnement de production
4. Le fichier `proxy.ts` intercepte automatiquement toute navigation vers `/admin/*` (sauf `/admin/login`) et redirige vers la mire de connexion si le cookie est absent.
5. Côté serveur, les Server Components ([AdminDashboardPage](file:///Users/macbook/Desktop/Autres%20Dossiers/SOUMANGOUROU%20TECHNOLOGIE/site%20web%20soumangourou/app/admin/dashboard/page.tsx), [AdminMessagesPage](file:///Users/macbook/Desktop/Autres%20Dossiers/SOUMANGOUROU%20TECHNOLOGIE/site%20web%20soumangourou/app/admin/messages/page.tsx)) et les API d'administration vérifient cryptographiquement le jeton via `getAdminFromCookies()`.

### Row Level Security (RLS) Supabase
Le fichier `supabase/schema.sql` applique des politiques de sécurité strictes :
* Les tables sensibles (`users`, `contacts`, `newsletters`) **ne sont pas accessibles publiquement en lecture**.
* Les visiteurs non authentifiés (`anon`) peuvent uniquement soumettre des formulaires (`INSERT`) via les routes d'API sécurisées par validation Zod.
* Le bucket Supabase Storage `uploads` n'autorise que les utilisateurs authentifiés (`authenticated`) ou le serveur (`service_role`) à téléverser, modifier ou supprimer des fichiers.

---

## 7. Architecture de l'Application

### Page d'Accueil (`app/page.tsx`)
La page d'accueil est un **Server Component** Next.js avec `revalidate = 0` garantissant un affichage instantané dès qu'une modification est enregistrée dans le CMS.

Elle agrège les composants suivants :
* **`Header`** : Navigation responsive avec logo, ancres douces et bouton CTA.
* **`Hero`** : Vidéo de fond avec contrôle de sourdine audio et titres configurables.
* **`ProjectsCarousel`** : Carrousel interactif propulsé par Embla Carousel.
* **`AboutSection`** : Image emblématique, badge statistique et 4 valeurs fondamentales.
* **`BlogSection`** : Affichage des 6 derniers articles publiés.
* **`ContactSection`** : Coordonnées (téléphone `+2250706045256`, email, adresse), formulaire avec validation Zod et iframe Google Maps dynamique.
* **`Footer`** : Slogan, réseaux sociaux, module d'inscription newsletter et copyright.

---

## 8. Référence des API Routes

| Endpoint | Méthode | Accès | Description |
|---|---|---|---|
| `/api/auth/login` | `POST` | Public | Authentifie un admin (`email`, `password`) et pose le cookie `admin_token`. |
| `/api/auth/logout` | `POST` | Authentifié | Supprime le cookie de session admin. |
| `/api/auth/logout` | `GET` | Authentifié | Retourne l'état de session courant. |
| `/api/settings` | `GET` | Public | Retourne les paramètres généraux et SEO du site. |
| `/api/settings` | `PUT` | Admin | Met à jour les paramètres du site (Hero, À propos, Contact, Couleurs, SEO). |
| `/api/contact` | `POST` | Public | Enregistre un message après validation stricte par schéma Zod. |
| `/api/contact` | `GET` | Admin | Liste l'ensemble des messages reçus par ordre antéchronologique. |
| `/api/blog` | `GET` | Public | Liste les articles de blog publiés. |
| `/api/blog` | `POST` | Admin | Crée un nouvel article de blog. |
| `/api/blog?id=...` | `DELETE` | Admin | Supprime un article par son identifiant. |
| `/api/projects` | `GET` | Public | Liste les projets ordonnés. |
| `/api/projects` | `POST` | Admin | Ajoute un nouveau projet au catalogue. |
| `/api/projects?id=...` | `DELETE` | Admin | Supprime un projet par son identifiant. |
| `/api/gallery` | `GET` | Public | Récupère la liste des images de la galerie. |
| `/api/gallery` | `POST` | Admin | Ajoute une photo à la galerie. |
| `/api/gallery?id=...` | `DELETE` | Admin | Supprime une photo de la galerie. |
| `/api/upload` | `POST` | Admin | Téléversement sécurisé de fichier sur Supabase Storage (max 5 Mo, images uniquement). |
| `/api/youtube` | `GET` / `POST` / `DELETE` | Public / Admin | Gestion des vidéos YouTube. |
| `/api/newsletter` | `POST` | Public | Inscription d'un email à la newsletter. |

---

## 9. Espace Administration (CMS)

Pour accéder au CMS :
1. Rendez-vous sur `/admin/login`.
2. Saisissez vos identifiants administrateurs créés lors du seed ou créés manuellement en base.
3. Le tableau de bord (`/admin/dashboard`) offre une vue d'ensemble sur :
   * Le nombre total de projets, d'articles, de vidéos et de messages.
   * Les 5 derniers messages reçus avec coordonnées directes.
4. L'onglet **Paramètres Site** (`/admin/settings`) est divisé en 6 sous-sections :
   * **1. Hero** : Titre, sous-titre, URL vidéo, bouton CTA.
   * **2. À Propos** : Titres, paragraphes de présentation, image noble, badge d'excellence et les 4 valeurs clés.
   * **3. Contact** : Email, téléphone officiel (`+2250706045256`), adresse physique et iframe Google Maps.
   * **4. SEO** : Titre meta, meta description, mots-clés, handle Twitter / X et copyright.
   * **5. Menu** : Ajout, modification et suppression des liens de la barre de navigation.
   * **6. Couleurs** : Personnalisation des codes hexadécimaux de la charte graphique.

---

## 10. Procédures de Maintenance Courante

### Modifier les coordonnées de l'entreprise
Les coordonnées officielles sont configurables directement depuis `/admin/settings` (onglet Contact) ou dans les valeurs par défaut de secours dans :
* [components/sections/ContactSection.tsx](file:///Users/macbook/Desktop/Autres%20Dossiers/SOUMANGOUROU%20TECHNOLOGIE/site%20web%20soumangourou/components/sections/ContactSection.tsx)
* [app/layout.tsx](file:///Users/macbook/Desktop/Autres%20Dossiers/SOUMANGOUROU%20TECHNOLOGIE/site%20web%20soumangourou/app/layout.tsx)
* [prisma/schema.prisma](file:///Users/macbook/Desktop/Autres%20Dossiers/SOUMANGOUROU%20TECHNOLOGIE/site%20web%20soumangourou/prisma/schema.prisma)

### Réinitialiser le mot de passe administrateur
Pour régénérer le compte administrateur, exécutez le script de seed :
```bash
npm run db:seed
```
Ou manuellement via un script Node.js générant un hash bcrypt :
```javascript
const bcrypt = require('bcryptjs');
const hash = bcrypt.hashSync('NouveauMotDePasseFort!', 10);
console.log(hash);
```
Puis mettez à jour la colonne `passwordHash` de la table `users`.

### Ajout d'une nouvelle table ou modification du schéma
1. Éditez [prisma/schema.prisma](file:///Users/macbook/Desktop/Autres%20Dossiers/SOUMANGOUROU%20TECHNOLOGIE/site%20web%20soumangourou/prisma/schema.prisma).
2. Lancez `npx prisma generate` pour mettre à jour les types TypeScript.
3. Lancez `npm run db:push` pour synchroniser la base PostgreSQL.
4. Mettez à jour [supabase/schema.sql](file:///Users/macbook/Desktop/Autres%20Dossiers/SOUMANGOUROU%20TECHNOLOGIE/site%20web%20soumangourou/supabase/schema.sql) pour maintenir le script SQL d'origine synchronisé avec ses règles RLS.

---

## 11. Déploiement en Production

Le projet est optimisé pour être hébergé sur **Vercel** ou tout hébergeur supportant Node.js / Docker.

### Configuration sur Vercel
1. Importer le dépôt GitHub sur votre tableau de bord Vercel.
2. Le framework sélectionné sera automatiquement **Next.js**.
3. Renseigner les variables d'environnement dans les paramètres du projet Vercel :
   * `DATABASE_URL`
   * `DIRECT_URL`
   * `JWT_SECRET`
   * `NEXT_PUBLIC_SUPABASE_URL`
   * `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   * `NEXT_PUBLIC_SITE_URL` (ex: `https://soumangouroutechnologie.com`)
4. La commande de build est définie dans `vercel.json` et `package.json` :
   ```bash
   prisma generate && next build
   ```

---

## 12. Standards de Qualité et Audit de Sécurité

Le projet applique les recommandations de sécurité **OWASP Top 10** et dispose d'un outil local d'audit automatisé :

* **Script d'analyse locale** :
  ```bash
  ~/security-tools/security-scan.sh
  ```
* **Outils exécutés** :
  * **Semgrep** : Détection des failles applicatives dans le code TypeScript et JavaScript.
  * **Trivy** : Audit des vulnérabilités de dépendances npm (CVE/GHSA).
  * **Gitleaks** : Détection de secrets ou jetons committés par inadvertance.

> **Règle impérative avant toute mise en production** :
> Exécuter `npm run build` et le scan de sécurité afin de certifier l'absence de vulnérabilités critiques ou hautes résiduelles.

