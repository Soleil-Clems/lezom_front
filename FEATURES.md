# Fonctionnalites de Lezom

Ce document liste les fonctionnalites principales de l'application et explique comment en ajouter de nouvelles.

## Fonctionnalites existantes

### Authentification

| Fonctionnalite | Endpoint | Description |
|---------------|----------|-------------|
| Inscription | `POST /api/auth/register` | Creation de compte avec email, username, mot de passe |
| Connexion | `POST /api/auth/login` | Authentification par email + mot de passe, retourne des cookies JWT |
| Refresh token | `POST /api/auth/refresh` | Renouvellement automatique de l'access token |
| Deconnexion | `POST /api/auth/logout` | Revocation du refresh token courant |
| Deconnexion totale | `POST /api/auth/logout-all` | Revocation de tous les refresh tokens |

**Details techniques :**
- Access token JWT (15 min) + refresh token (7 jours) en cookies httpOnly
- Mots de passe hashes avec bcrypt (10 salt rounds)
- Refresh tokens stockes hashes en base MySQL
- Validation : email unique, username unique, mot de passe >= 8 caracteres avec majuscule, minuscule et chiffre

### Gestion des utilisateurs

| Fonctionnalite | Endpoint | Description |
|---------------|----------|-------------|
| Mon profil | `GET /api/users/me` | Recuperer son profil |
| Modifier profil | `PUT /api/users/me` | Mettre a jour username, email, description, etc. |
| Voir un utilisateur | `GET /api/users/:id` | Consulter le profil d'un autre utilisateur |
| Supprimer son compte | `DELETE /api/users/me` | Suppression definitive du compte |
| Photo de profil | `PATCH /api/users/picture/:id` | Upload d'image vers S3 (JPEG, PNG, GIF, WebP, max 10 MB) |

### Serveurs

| Fonctionnalite | Endpoint | Description |
|---------------|----------|-------------|
| Creer un serveur | `POST /api/servers` | Cree un serveur et ajoute le createur comme OWNER |
| Lister mes serveurs | `GET /api/servers` | Serveurs dont l'utilisateur est membre |
| Details d'un serveur | `GET /api/servers/:id` | Infos du serveur (necessite d'etre membre) |
| Modifier un serveur | `PUT /api/servers/:id` | Nom, image (role OWNER ou ADMIN requis) |
| Supprimer un serveur | `DELETE /api/servers/:id` | Suppression (role OWNER requis) |
| Transferer la propriete | `POST /api/servers/:id/transfer/:userId` | Transferer le role OWNER a un autre membre |
| Quitter un serveur | `DELETE /api/servers/:id/leave` | Quitter un serveur (le OWNER ne peut pas quitter) |

### Membres et roles

| Fonctionnalite | Endpoint | Description |
|---------------|----------|-------------|
| Lister les membres | `GET /api/servers/:id/members` | Liste paginee avec recherche |
| Modifier un role | `PUT /api/servers/:id/members/:userId` | Changer le role d'un membre (OWNER/ADMIN/MODERATOR requis) |
| Expulser un membre | `DELETE /api/servers/:id/members/:userId` | Kick un membre du serveur |

**Hierarchie des roles :** `OWNER > ADMIN > MODERATOR > MEMBER`

Un utilisateur ne peut modifier que les roles inferieurs au sien.

### Invitations

| Fonctionnalite | Endpoint | Description |
|---------------|----------|-------------|
| Creer une invitation | `POST /api/servers/:id/invitations` | Genere un code avec expiration et limite d'utilisations optionnelles |
| Lister les invitations | `GET /api/servers/:id/invitations` | Toutes les invitations actives du serveur |
| Supprimer une invitation | `DELETE /api/servers/:id/invitations/:invitationId` | Revoquer une invitation |
| Rejoindre via invitation | `POST /api/servers/join/:code` | Utiliser un code d'invitation pour rejoindre |

### Bannissements

| Fonctionnalite | Endpoint | Description |
|---------------|----------|-------------|
| Bannir un utilisateur | `POST /api/servers/:id/bans` | Bannir avec raison (role OWNER/ADMIN requis) |
| Debannir | `DELETE /api/servers/:id/bans/:userId` | Lever le bannissement |
| Lister les bans | `GET /api/servers/:id/bans` | Tous les utilisateurs bannis du serveur |

### Channels

| Fonctionnalite | Endpoint | Description |
|---------------|----------|-------------|
| Creer un channel | `POST /api/channels` | Channel texte ou appel dans un serveur |
| Lister les channels | `GET /api/channels/server/:serverId` | Tous les channels d'un serveur |
| Details d'un channel | `GET /api/channels/:id` | Informations du channel |
| Modifier un channel | `PUT /api/channels/:id` | Nom, description, type |
| Supprimer un channel | `DELETE /api/channels/:id` | Suppression du channel |

**Types de channels :** `TEXT` (messages texte) et `CALL` (appels vocaux)

### Messages (channels)

| Fonctionnalite | Endpoint | Description |
|---------------|----------|-------------|
| Envoyer un message | `POST /api/messages` | Message dans un channel (types : text, voice, img, file, system, gif) |
| Historique | `GET /api/messages/channel/:id` | Messages du channel avec pagination |
| Modifier un message | `PATCH /api/messages/:id` | Modification (auteur uniquement) |
| Supprimer un message | `DELETE /api/messages/:id` | Suppression |

Chaque message envoye emet un evenement WebSocket `MESSAGE_CREATED` pour la mise a jour en temps reel.

### Messages prives (DMs)

| Fonctionnalite | Endpoint | Description |
|---------------|----------|-------------|
| Ouvrir/creer une conversation | `POST /api/conversations` | Cree ou recupere une conversation avec un utilisateur |
| Lister mes conversations | `GET /api/conversations` | Toutes les conversations de l'utilisateur |
| Details d'une conversation | `GET /api/conversations/:id` | Informations de la conversation |
| Lire les messages | `GET /api/conversations/:id/messages` | Messages avec pagination |
| Envoyer un message prive | `POST /api/conversations/:id/messages` | Message prive |
| Modifier un message | `PATCH /api/conversations/messages/:id` | Modification |
| Supprimer un message | `DELETE /api/conversations/messages/:id` | Suppression |

### Temps reel (WebSockets)

| Fonctionnalite | Evenement Socket.io | Description |
|---------------|---------------------|-------------|
| Presence | `USER_ONLINE` / `USER_OFFLINE` | Statut en ligne/hors ligne |
| Saisie en cours | `typing` / `dm:typing` | Indicateur "X est en train d'ecrire..." |
| Messages live | `MESSAGE_CREATED` | Nouveau message dans un channel |
| DMs live | `DM_MESSAGE_CREATED` | Nouveau message prive |
| Mises a jour serveur | `SERVER_UPDATED`, `MEMBER_JOINED`, etc. | Changements en temps reel |

### Administration

| Fonctionnalite | Endpoint | Description |
|---------------|----------|-------------|
| Lister tous les utilisateurs | `GET /api/admin/users` | Admin global uniquement |
| Voir un utilisateur | `GET /api/admin/users/:id` | Details complets |
| Creer un utilisateur | `POST /api/admin/users` | Creation par l'admin |
| Modifier un utilisateur | `PUT /api/admin/users/:id` | Modification par l'admin |
| Supprimer un utilisateur | `DELETE /api/admin/users/:id` | Suppression par l'admin |

---

## Comment ajouter une nouvelle fonctionnalite

### Etapes a suivre

Voici le processus pour ajouter une fonctionnalite au backend. L'exemple utilise l'ajout d'un systeme de **reactions aux messages**.

#### 1. Modele de donnees

Si la fonctionnalite necessite de nouvelles donnees, commencer par le schema.

**Pour MySQL (Prisma)** — creer `backend/prisma/schema/reaction.prisma` :

```prisma
model Reaction {
  id        String   @id @default(uuid())
  messageId String
  userId    String
  emoji     String
  createdAt DateTime @default(now())

  @@unique([messageId, userId, emoji])
  @@index([messageId])
}
```

Puis appliquer :

```bash
npm run prisma:migrate
npm run prisma:generate
```

**Pour MongoDB (Mongoose)** — creer `backend/src/models/Reaction.js` :

```javascript
const mongoose = require("mongoose");

const reactionSchema = new mongoose.Schema({
  message_id: { type: String, required: true },
  user_id: { type: String, required: true },
  emoji: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

reactionSchema.index({ message_id: 1 });

module.exports = mongoose.model("Reaction", reactionSchema);
```

#### 2. Validateur

Creer `backend/src/validators/reaction.validator.js` :

```javascript
const Joi = require("joi");

const addReaction = Joi.object({
  messageId: Joi.string().uuid().required(),
  emoji: Joi.string().max(10).required(),
});

const removeReaction = Joi.object({
  messageId: Joi.string().uuid().required(),
  emoji: Joi.string().max(10).required(),
});

module.exports = { addReaction, removeReaction };
```

#### 3. Service

Creer `backend/src/services/reaction.service.js` avec la logique metier :

```javascript
const prisma = require("../config/database").prisma;
// ou: const Reaction = require("../models/Reaction");
const { emitToChannel } = require("../utils/socketEvents");

const addReaction = async (messageId, userId, emoji) => {
  const reaction = await prisma.reaction.create({
    data: { messageId, userId, emoji },
  });
  emitToChannel(/* channelId */, "REACTION_ADDED", reaction);
  return reaction;
};

const removeReaction = async (messageId, userId, emoji) => {
  await prisma.reaction.delete({
    where: {
      messageId_userId_emoji: { messageId, userId, emoji },
    },
  });
  emitToChannel(/* channelId */, "REACTION_REMOVED", { messageId, userId, emoji });
};

const getReactions = async (messageId) => {
  return prisma.reaction.findMany({ where: { messageId } });
};

module.exports = { addReaction, removeReaction, getReactions };
```

#### 4. Controller

Creer `backend/src/controllers/reaction.controller.js` :

```javascript
const reactionService = require("../services/reaction.service");

const addReaction = async (req, res) => {
  try {
    const reaction = await reactionService.addReaction(
      req.body.messageId,
      req.user.id,
      req.body.emoji
    );
    res.status(201).json(reaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const removeReaction = async (req, res) => {
  try {
    await reactionService.removeReaction(
      req.params.messageId,
      req.user.id,
      req.params.emoji
    );
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addReaction, removeReaction };
```

#### 5. Routes

Creer `backend/src/routes/reaction.routes.js` :

```javascript
const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const validate = require("../middleware/validate");
const reactionValidator = require("../validators/reaction.validator");
const reactionController = require("../controllers/reaction.controller");

router.post(
  "/",
  verifyToken,
  validate(reactionValidator.addReaction),
  reactionController.addReaction
);

router.delete(
  "/:messageId/:emoji",
  verifyToken,
  reactionController.removeReaction
);

module.exports = router;
```

#### 6. Enregistrer la route

Dans `backend/src/app.js`, ajouter :

```javascript
const reactionRoutes = require("./routes/reaction.routes");
app.use("/api/reactions", reactionRoutes);
```

#### 7. Evenements WebSocket (si necessaire)

Ajouter les constantes dans `backend/src/utils/socketEvents.js` :

```javascript
REACTION_ADDED: "reaction:added",
REACTION_REMOVED: "reaction:removed",
```

#### 8. Tests

Creer les tests dans `backend/__tests__/` :

```javascript
// __tests__/api/reaction.test.js
describe("Reactions API", () => {
  it("should add a reaction to a message", async () => {
    // ...
  });

  it("should remove a reaction", async () => {
    // ...
  });
});
```

Lancer les tests :

```bash
npm test
```

### Recapitulatif des fichiers a creer/modifier

Pour chaque nouvelle fonctionnalite :

| Etape | Fichier | Action |
|-------|---------|--------|
| 1 | `prisma/schema/<entity>.prisma` ou `src/models/<Entity>.js` | Creer le modele de donnees |
| 2 | `src/validators/<entity>.validator.js` | Creer les schemas de validation |
| 3 | `src/services/<entity>.service.js` | Creer la logique metier |
| 4 | `src/controllers/<entity>.controller.js` | Creer le controller |
| 5 | `src/routes/<entity>.routes.js` | Definir les routes |
| 6 | `src/app.js` | Enregistrer les nouvelles routes |
| 7 | `src/utils/socketEvents.js` | Ajouter les evenements temps reel (si besoin) |
| 8 | `__tests__/` | Ecrire les tests |

### Conventions du projet

- **Nommage des fichiers** : `kebab-case` pour les fichiers (`auth.controller.js`, `server-member.prisma`)
- **Validation** : Toujours valider les entrees avec un schema Joi via le middleware `validate`
- **Authentification** : Proteger les routes avec `verifyToken` en middleware
- **Autorisation** : Utiliser `isMember`, `hasServerRole(roles)`, `isNotBanned` pour les routes serveur
- **Erreurs** : Utiliser la classe `AppError` pour les erreurs metier (`new AppError("message", 404)`)
- **Temps reel** : Emettre les evenements WebSocket depuis les services via `emitToServer`, `emitToChannel` ou `emitToUser`
- **Messages MongoDB** : Les messages utilisent des UUID comme `_id` (pas l'ObjectId par defaut)
- **Types de messages** : `text`, `voice`, `img`, `file`, `system`, `gif`
- **Roles** : Respecter la hierarchie `OWNER > ADMIN > MODERATOR > MEMBER`
