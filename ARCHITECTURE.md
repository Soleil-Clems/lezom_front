# Architecture de Lezom

Ce document decrit l'architecture technique du projet Lezom.

## Vue d'ensemble

```
┌─────────────┐         ┌──────────────────────────────────────────┐
│   Client    │  HTTP/   │              Backend (Express.js)        │
│  (Next.js)  │◄────────►│                                          │
│  Port 3000  │  WS      │  ┌──────────┐  ┌──────────┐  ┌───────┐ │
└─────────────┘         │  │Controllers│──│ Services │──│Models │ │
                        │  └──────────┘  └──────────┘  └───────┘ │
                        │       │                          │   │   │
                        │  ┌────┴─────┐              ┌─────┘   │   │
                        │  │Middleware │              │         │   │
                        │  └──────────┘              │         │   │
                        │              Port 3001     │         │   │
                        └────────────────────────────┼─────────┼───┘
                                                     │         │
                                              ┌──────┘         └──────┐
                                              │                       │
                                        ┌─────┴─────┐          ┌─────┴─────┐
                                        │   MySQL   │          │  MongoDB  │
                                        │  (Prisma) │          │(Mongoose) │
                                        │  Port 3306│          │ Port 27017│
                                        └───────────┘          └───────────┘
```

## Structure des dossiers

```
T-JSF-600-MAR_13/
├── backend/
│   ├── src/
│   │   ├── controllers/       # Logique de routing (8 controllers)
│   │   ├── services/          # Logique metier (7 services)
│   │   ├── routes/            # Definition des routes Express (7 fichiers)
│   │   ├── middleware/        # Auth, validation, upload, roles (5 fichiers)
│   │   ├── models/            # Schemas Mongoose pour MongoDB (2 schemas)
│   │   ├── validators/        # Schemas de validation Joi (10 fichiers)
│   │   ├── utils/             # Utilitaires (erreurs, auth, storage, socket)
│   │   ├── config/            # Configuration (DB, JWT, Socket, Swagger)
│   │   ├── app.js             # Configuration Express (middlewares, routes, CORS)
│   │   └── index.js           # Point d'entree du serveur
│   ├── prisma/
│   │   └── schema/            # Schemas Prisma multi-fichiers (9 fichiers)
│   ├── __tests__/             # Tests (API + unitaires)
│   ├── Dockerfile
│   └── package.json
├── client/
│   ├── app/                   # App Router Next.js
│   │   ├── layout.tsx         # Layout racine
│   │   ├── page.tsx           # Page d'accueil
│   │   └── globals.css        # Styles globaux (Tailwind)
│   ├── public/                # Assets statiques
│   └── package.json
├── docker-compose.yml         # Orchestration des services
└── .github/workflows/ci.yml  # Pipeline CI/CD
```

## Backend

### Pattern architectural

Le backend suit un pattern **Controller → Service → Model** en couches :

```
Route → Middleware → Controller → Service → Model/Database
```

1. **Routes** : Definissent les endpoints HTTP et associent les middlewares
2. **Middlewares** : Gerent l'authentification, l'autorisation, la validation et l'upload
3. **Controllers** : Recoivent les requetes, appellent les services, formatent les reponses
4. **Services** : Contiennent la logique metier
5. **Models** : Interagissent avec la base de donnees (Prisma pour MySQL, Mongoose pour MongoDB)

### Controllers

| Controller | Fichier | Responsabilite |
|-----------|---------|----------------|
| Auth | `auth.controller.js` | Inscription, connexion, refresh token, deconnexion |
| User | `user.controller.js` | Profil utilisateur, photo de profil |
| Server | `server.controller.js` | CRUD serveurs, membres, invitations, transfert de propriete |
| Channel | `channel.controller.js` | CRUD channels (texte/appel) |
| Message | `message.controller.js` | CRUD messages dans les channels |
| Conversation | `conversation.controller.js` | Messages prives, CRUD conversations |
| Ban | `ban.controller.js` | Bannissement/debannissement |
| Admin | `admin.controller.js` | Gestion admin des utilisateurs |

### Services

| Service | Fichier | Role |
|---------|---------|------|
| Auth | `auth.service.js` | Hash des mots de passe, generation/validation des tokens, gestion des refresh tokens |
| User | `user.service.js` | CRUD profil, upload photo vers S3 |
| Server | `server.service.js` | Logique serveurs, hierarchie des roles, codes d'invitation |
| Channel | `channel.service.js` | Logique channels |
| Message | `message.service.js` | Stockage MongoDB, emission WebSocket |
| Conversation | `conversation.service.js` | Conversations privees, messages prives |
| Ban | `ban.service.js` | Logique de bannissement |

### Middlewares

| Middleware | Fichier | Fonctions |
|-----------|---------|-----------|
| Auth | `auth.js` | `verifyToken` — Validation JWT depuis les cookies |
| | | `verifyAdmin` — Verification du role admin global |
| Server | `server.js` | `isMember` — Verification d'appartenance au serveur |
| | | `hasServerRole(roles)` — Verification du role dans le serveur |
| | | `isNotBanned` — Verification de non-bannissement |
| Channel | `channel.js` | `isChannelMember` — Verification d'appartenance au serveur du channel |
| | | `hasChannelRole(roles)` — Verification du role pour le channel |
| Upload | `upload.js` | `imageUpload` — Configuration Multer (memoire, 10MB max, JPEG/PNG/GIF/WebP) |
| Validate | `validate.js` | Validation des corps de requete avec les schemas Joi |

### Routes API

| Prefix | Fichier | Endpoints principaux |
|--------|---------|---------------------|
| `/api/auth` | `auth.routes.js` | `POST /register`, `POST /login`, `POST /refresh`, `POST /logout` |
| `/api/users` | `user.routes.js` | `GET /me`, `PUT /me`, `GET /:id`, `DELETE /me`, `PATCH /picture/:id` |
| `/api/admin` | `admin.routes.js` | CRUD utilisateurs (protege par `verifyAdmin`) |
| `/api/servers` | `server.routes.js` | CRUD serveurs, membres, invitations, bans |
| `/api/channels` | `channel.routes.js` | CRUD channels |
| `/api/messages` | `message.routes.js` | CRUD messages |
| `/api/conversations` | `conversation.routes.js` | CRUD conversations et messages prives |

### Validation

Chaque route utilise des schemas **Joi** pour valider les donnees entrantes :

| Fichier | Schemas |
|---------|---------|
| `auth.validator.js` | Inscription, connexion |
| `user.validator.js` | Mise a jour du profil |
| `server.validator.js` | CRUD serveur, invitations |
| `channel.validator.js` | CRUD channel |
| `message.validator.js` | Creation/mise a jour de message |
| `conversation.validator.js` | Conversations et messages prives |
| `admin.validator.js` | Gestion admin |
| `ban.validator.js` | Creation de ban |

## Base de donnees

### Architecture hybride

Le projet utilise deux bases de donnees pour des raisons de performance et de flexibilite :

- **MySQL** (via Prisma) : Donnees relationnelles avec contraintes d'integrite (utilisateurs, serveurs, roles, etc.)
- **MongoDB** (via Mongoose) : Messages (volume eleve, schema flexible, index compose sur `channel_id + created_at`)

### Schemas Prisma (MySQL)

Les schemas sont repartis en fichiers modulaires dans `backend/prisma/schema/` :

| Fichier | Entite | Champs cles |
|---------|--------|-------------|
| `user.prisma` | User | id, username, email, password, role (MEMBER/ADMIN), status, img |
| `server.prisma` | Server | id, name, img, ownerId |
| `server-member.prisma` | ServerMember | userId, serverId, role (OWNER/ADMIN/MODERATOR/MEMBER) |
| `channel.prisma` | Channel | serverId, name, type (TEXT/CALL) |
| `conversation.prisma` | Conversation | user1Id, user2Id (unique) |
| `invitation.prisma` | Invitation | code (unique), serverId, expiresAt, maxUses, usesCount |
| `ban.prisma` | Ban | serverId, userId, bannedBy, reason |
| `refresh-token.prisma` | RefreshToken | tokenHash, userId, expiresAt, isRevoked |

### Schemas Mongoose (MongoDB)

| Modele | Champs | Index |
|--------|--------|-------|
| Message | channel_id, author_id, content, type (text/voice/img/file/system/gif) | `{channel_id: 1, created_at: -1}` |
| PrivateMessage | conversation_id, sender_id, content, type | `{conversation_id: 1, created_at: -1}` |

### Hierarchie des roles serveur

```
OWNER > ADMIN > MODERATOR > MEMBER
```

- **OWNER** : Acces total, transfert de propriete, suppression du serveur
- **ADMIN** : Gestion des membres, channels, invitations
- **MODERATOR** : Kick, gestion limitee des membres
- **MEMBER** : Lecture et ecriture de messages

## Authentification

### Flux JWT

```
1. Login/Register
   Client ──POST /api/auth/login──► Backend
   Client ◄──Set-Cookie (accessToken + refreshToken)── Backend

2. Requete authentifiee
   Client ──GET /api/users/me + Cookie── ► Backend
   Backend : verifyToken middleware → decode JWT → req.user

3. Refresh du token
   Client ──POST /api/auth/refresh + Cookie── ► Backend
   Backend : valide refreshToken (bcrypt) → nouveau accessToken
```

- **Access token** : JWT, expire en 15 minutes, envoye en cookie httpOnly
- **Refresh token** : Stocke hashe (bcrypt) en base, expire en 7 jours
- Les cookies sont `httpOnly`, `secure` en production, `sameSite: lax`

## Communication temps reel

### Socket.io

Le serveur Socket.io est attache au serveur HTTP Express et gere :

**Evenements recus (client → serveur) :**

| Evenement | Description |
|-----------|-------------|
| `server:join` | Rejoindre la room d'un serveur |
| `server:leave` | Quitter la room d'un serveur |
| `channel:join` | Rejoindre la room d'un channel |
| `channel:leave` | Quitter la room d'un channel |
| `typing` | Indicateur de saisie dans un channel |
| `dm:typing` | Indicateur de saisie dans un DM |
| `dm:stopTyping` | Arret de saisie dans un DM |

**Evenements emis (serveur → client) :**

| Evenement | Description |
|-----------|-------------|
| `SERVER_UPDATED` / `SERVER_DELETED` | Mise a jour/suppression de serveur |
| `MEMBER_JOINED` / `MEMBER_LEFT` / `MEMBER_KICKED` | Mouvements de membres |
| `MEMBER_BANNED` / `MEMBER_UNBANNED` | Bannissements |
| `MEMBER_ROLE_CHANGED` / `SERVER_OWNER_CHANGED` | Changements de roles |
| `CHANNEL_CREATED` / `CHANNEL_UPDATED` / `CHANNEL_DELETED` | Evenements channels |
| `MESSAGE_CREATED` / `MESSAGE_UPDATED` / `MESSAGE_DELETED` | Messages de channel |
| `DM_MESSAGE_CREATED` / `DM_MESSAGE_UPDATED` / `DM_MESSAGE_DELETED` | Messages prives |
| `USER_ONLINE` / `USER_OFFLINE` | Presence utilisateur |

**Fonctions de broadcast :**

```javascript
emitToServer(serverId, event, data)   // Tous les membres du serveur
emitToChannel(channelId, event, data) // Tous les membres du channel
emitToUser(userId, event, data)       // Un utilisateur specifique
```

## Stockage de fichiers

Les fichiers (photos de profil, images partagees) sont stockes sur **AWS S3** (ou compatible R2/Minio) :

- Upload via **Multer** en memoire (pas d'ecriture disque)
- Validation de type (JPEG, PNG, GIF, WebP) et de taille (10 MB max)
- Upload vers S3 via **AWS SDK v3** (`@aws-sdk/client-s3`)
- Support d'un domaine public personnalise (`R2_PUBLIC_DOMAIN`)

## Frontend

Le frontend utilise **Next.js 16** avec l'App Router et **React 19** :

- **Styling** : Tailwind CSS 4
- **Langage** : TypeScript 5
- **Police** : Geist (sans-serif + monospace)

## Infrastructure

### Docker Compose

Le fichier `docker-compose.yml` orchestre 3 services :

| Service | Image | Port | Description |
|---------|-------|------|-------------|
| `mysql` | `mysql:8` | 3306 | Base de donnees relationnelle |
| `mongodb` | `mongo:7` | 27017 | Base de donnees de messages |
| `backend` | Build local | 3001 | API Express.js |

### CI/CD (GitHub Actions)

Le pipeline CI s'execute sur chaque push/PR vers `main` ou `develop` :

1. Checkout du code
2. Setup Node.js 20 avec cache npm
3. Installation des dependances (`npm ci`)
4. Generation du client Prisma
5. Execution des tests (`npm test`)

## Securite

| Aspect | Implementation |
|--------|---------------|
| Authentification | JWT en cookies httpOnly + refresh tokens hashes |
| Mots de passe | Hashage bcrypt (10 salt rounds) |
| Autorisation | RBAC par serveur (OWNER/ADMIN/MODERATOR/MEMBER) |
| Validation | Schemas Joi sur toutes les routes |
| CORS | Configure pour l'URL du frontend uniquement |
| Upload | Validation de type MIME et limite de taille |
| SQL Injection | Prevention via Prisma ORM (requetes parametrees) |
