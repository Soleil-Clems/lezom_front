# Lezom

Lezom est une application de messagerie instantanee inspiree de Discord, concue et developpee dans le cadre d'un projet scolaire.
L'objectif : reproduire les fonctionnalites essentielles d'une plateforme de communication moderne, du chat en temps reel aux messages prives, en passant par la gestion de serveurs communautaires.

## Presentation

Lezom permet a ses utilisateurs de :

- **Creer et rejoindre des serveurs** — Chaque serveur est un espace communautaire avec ses propres channels de discussion (texte ou appel).
- **Discuter en temps reel** — Les messages sont envoyes et recus instantanement grace a un systeme de WebSockets.
- **Envoyer des messages prives** — Les utilisateurs peuvent echanger en prive via un systeme de conversations directes (DMs).
- **Gerer les membres** — Systeme de roles par serveur (owner, admin, moderateur, membre) avec la possibilite de bannir des utilisateurs.
- **Inviter des amis** — Generation de liens d'invitation avec expiration et limite d'utilisations.
- **Partager differents types de contenus** — Texte, images, fichiers, GIFs et messages vocaux.
- **Voir qui est en ligne** — Presence en temps reel des utilisateurs connectes.

## Stack technique

| Couche | Technologies |
|--------|-------------|
| Backend | Express.js, Prisma, Mongoose, Socket.io |
| Frontend | Next.js 16, React 19, Tailwind CSS |
| Bases de donnees | MySQL 8 (donnees relationnelles), MongoDB 7 (messages) |
| Authentification | JWT (access + refresh tokens), bcrypt |
| Stockage fichiers | AWS S3 / Cloudflare R2 |
| Temps reel | WebSockets (Socket.io) |
| Infrastructure | Docker, Docker Compose, GitHub Actions CI |

## Demarrage rapide

### Prerequis

- [Node.js](https://nodejs.org/) v20+
- [Docker](https://www.docker.com/) et Docker Compose
- npm

### Avec Docker (recommande)

```bash
# Cloner le projet
git clone <url-du-repo>
cd T-JSF-600-MAR_13

# Lancer les services (MySQL, MongoDB, Backend)
docker compose up -d

# L'API est accessible sur http://localhost:3001
# La documentation Swagger est sur http://localhost:3001/api-docs
```

### En local (developpement)

```bash
# Backend
cd backend
npm install
cp .env.example .env          # Configurer les variables d'environnement
npm run prisma:generate        # Generer le client Prisma
npm run prisma:migrate         # Appliquer les migrations
npm run dev                    # Demarre sur http://localhost:3001

# Frontend
cd client
npm install
npm run dev                    # Demarre sur http://localhost:3000
```

### Variables d'environnement

| Variable | Description | Exemple |
|----------|-------------|---------|
| `PORT` | Port du serveur backend | `3001` |
| `DATABASE_URL` | URL de connexion MySQL | `mysql://user:pass@localhost:3306/lezom` |
| `MONGODB_URI` | URL de connexion MongoDB | `mongodb://localhost:27017/lezom` |
| `JWT_SECRET` | Cle secrete pour les tokens JWT | `your-secret-key` |
| `FRONTEND_URL` | URL du frontend (CORS) | `http://localhost:3000` |
| `S3_BUCKET_NAME` | Nom du bucket S3 | `lezom-uploads` |
| `S3_ACCESS_KEY` | Cle d'acces S3 | - |
| `S3_SECRET_ACCESS_KEY` | Cle secrete S3 | - |
| `S3_REGION` | Region S3 | `eu-west-1` |
| `S3_ENDPOINT` | Endpoint S3 (optionnel, pour R2) | - |

## Schema de la base de donnees

La base de donnees utilise une architecture hybride :

- **MySQL** (via Prisma) pour les donnees relationnelles (utilisateurs, serveurs, membres, channels, invitations, bans, tokens)
- **MongoDB** (via Mongoose) pour les messages (messages de channels et messages prives)

### Tables MySQL

| Table | Description |
|-------|-------------|
| `users` | Comptes utilisateurs avec profil et role global |
| `server` | Serveurs communautaires |
| `server_member` | Membres d'un serveur avec leur role |
| `bans` | Bannissements de serveur avec raison |
| `invitations` | Liens d'invitation aux serveurs |
| `channel` | Channels de discussion au sein d'un serveur |
| `conversation` | Conversations privees entre deux utilisateurs |
| `refresh_tokens` | Tokens de rafraichissement pour l'authentification |

### Collections MongoDB

| Collection | Description |
|------------|-------------|
| `messages` | Messages envoyes dans les channels |
| `private_messages` | Messages au sein d'une conversation privee |

## Documentation

- [Architecture du projet](./ARCHITECTURE.md)
- [Fonctionnalites et guide developpeur](./FEATURES.md)
- [Documentation API (Swagger)](http://localhost:3001/api-docs) — disponible quand le serveur tourne

## Scripts utiles

```bash
# Backend
npm run dev              # Lancer en mode developpement
npm test                 # Lancer les tests
npm run test:coverage    # Tests avec couverture
npm run prisma:studio    # Interface graphique pour la BDD

# Frontend
npm run dev              # Lancer en mode developpement
npm run build            # Build de production
```

## Equipe

Projet realise en groupe dans le cadre d'un cursus scolaire.
