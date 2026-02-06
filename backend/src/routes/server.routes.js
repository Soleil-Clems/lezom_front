const express = require("express");
const router = express.Router();
const {
  createServer,
  getServers,
  getServer,
  updateServer,
  deleteServer,
  getMembers,
  updateMemberRole,
  kickMember,
  leaveServer,
  transferOwnership,
  createInvitation,
  getInvitations,
  deleteInvitation,
  joinServer,
} = require("../controllers/server.controller");
const { banUser, unbanUser, getBans } = require("../controllers/ban.controller");
const { verifyToken } = require("../middleware/auth");
const { isMember, hasServerRole } = require("../middleware/server");
const validate = require("../middleware/validate");
const {
  createServerSchema,
  updateServerSchema,
  updateMemberRoleSchema,
  createInvitationSchema,
} = require("../validators/server.validator");
const { banUserSchema } = require("../validators/ban.validator");

router.use(verifyToken);

/**
 * @swagger
 * /api/servers:
 *   post:
 *     summary: Create a new server
 *     tags: [Servers]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: My Server
 *     responses:
 *       201:
 *         description: Server created successfully
 *       400:
 *         description: Validation error
 */
router.post("/", validate(createServerSchema), createServer);

/**
 * @swagger
 * /api/servers:
 *   get:
 *     summary: List user's servers
 *     tags: [Servers]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of servers
 */
router.get("/", getServers);

/**
 * @swagger
 * /api/servers/{id}:
 *   get:
 *     summary: Get server details
 *     tags: [Servers]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Server ID
 *     responses:
 *       200:
 *         description: Server details
 *       403:
 *         description: Not a member
 *       404:
 *         description: Server not found
 */
router.get("/:id", isMember, getServer);

/**
 * @swagger
 * /api/servers/{id}:
 *   put:
 *     summary: Update server
 *     tags: [Servers]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Server ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               img:
 *                 type: string
 *     responses:
 *       200:
 *         description: Server updated successfully
 *       400:
 *         description: Validation error
 *       403:
 *         description: Not authorized
 */
router.put("/:id", hasServerRole(["OWNER", "ADMIN"]), validate(updateServerSchema), updateServer);

/**
 * @swagger
 * /api/servers/{id}:
 *   delete:
 *     summary: Delete server
 *     tags: [Servers]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Server ID
 *     responses:
 *       200:
 *         description: Server deleted successfully
 *       403:
 *         description: Only owner can delete
 */
router.delete("/:id", hasServerRole(["OWNER"]), deleteServer);

/**
 * @swagger
 * /api/servers/join/{code}:
 *   post:
 *     summary: Join a server via invitation code
 *     tags: [Servers]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Invitation code
 *     responses:
 *       201:
 *         description: Joined server successfully
 *       400:
 *         description: Already a member or invitation expired/maxed
 *       403:
 *         description: Banned from server
 *       404:
 *         description: Invalid invitation code
 */
router.post("/join/:code", joinServer);

/**
 * @swagger
 * /api/servers/{id}/leave:
 *   delete:
 *     summary: Leave a server
 *     tags: [Servers]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Server ID
 *     responses:
 *       200:
 *         description: Left server successfully
 *       400:
 *         description: Owner cannot leave
 *       403:
 *         description: Not a member
 */
router.delete("/:id/leave", isMember, leaveServer);

/**
 * @swagger
 * /api/servers/{id}/members:
 *   get:
 *     summary: Get server members
 *     tags: [Servers]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Server ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by username
 *     responses:
 *       200:
 *         description: Paginated member list
 *       403:
 *         description: Not a member
 */
router.get("/:id/members", isMember, getMembers);

/**
 * @swagger
 * /api/servers/{id}/members/{userId}:
 *   put:
 *     summary: Update member role
 *     tags: [Servers]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Server ID
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: Target user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [ADMIN, MODERATOR, MEMBER]
 *     responses:
 *       200:
 *         description: Member role updated successfully
 *       400:
 *         description: Cannot assign owner role
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Member not found
 */
router.put("/:id/members/:userId", hasServerRole(["OWNER", "ADMIN", "MODERATOR"]), validate(updateMemberRoleSchema), updateMemberRole);

/**
 * @swagger
 * /api/servers/{id}/members/{userId}:
 *   delete:
 *     summary: Kick a member
 *     tags: [Servers]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Server ID
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to kick
 *     responses:
 *       200:
 *         description: Member kicked successfully
 *       400:
 *         description: Cannot kick yourself
 *       403:
 *         description: Not authorized or target has higher role
 *       404:
 *         description: Member not found
 */
router.delete("/:id/members/:userId", hasServerRole(["OWNER", "ADMIN", "MODERATOR"]), kickMember);

/**
 * @swagger
 * /api/servers/{id}/transfer/{userId}:
 *   post:
 *     summary: Transfer server ownership
 *     tags: [Servers]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Server ID
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: New owner user ID
 *     responses:
 *       200:
 *         description: Ownership transferred successfully
 *       400:
 *         description: Already the owner
 *       403:
 *         description: Only owner can transfer
 *       404:
 *         description: Member not found
 */
router.post("/:id/transfer/:userId", hasServerRole(["OWNER"]), transferOwnership);

/**
 * @swagger
 * /api/servers/{id}/invitations:
 *   post:
 *     summary: Create an invitation
 *     tags: [Servers]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Server ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               maxUses:
 *                 type: integer
 *                 example: 10
 *               expiresIn:
 *                 type: integer
 *                 description: Expiration in seconds
 *                 example: 86400
 *     responses:
 *       201:
 *         description: Invitation created successfully
 *       403:
 *         description: Not authorized
 */
router.post("/:id/invitations", hasServerRole(["OWNER", "ADMIN"]), validate(createInvitationSchema), createInvitation);

/**
 * @swagger
 * /api/servers/{id}/invitations:
 *   get:
 *     summary: List server invitations
 *     tags: [Servers]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Server ID
 *     responses:
 *       200:
 *         description: List of invitations
 *       403:
 *         description: Not authorized
 */
router.get("/:id/invitations", hasServerRole(["OWNER", "ADMIN"]), getInvitations);

/**
 * @swagger
 * /api/servers/{id}/invitations/{invitationId}:
 *   delete:
 *     summary: Delete an invitation
 *     tags: [Servers]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Server ID
 *       - in: path
 *         name: invitationId
 *         required: true
 *         schema:
 *           type: string
 *         description: Invitation ID
 *     responses:
 *       200:
 *         description: Invitation deleted successfully
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Invitation not found
 */
router.delete("/:id/invitations/:invitationId", hasServerRole(["OWNER", "ADMIN"]), deleteInvitation);

/**
 * @swagger
 * /api/servers/{id}/bans:
 *   post:
 *     summary: Ban a user from server
 *     tags: [Servers]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Server ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *               reason:
 *                 type: string
 *                 example: Spamming
 *     responses:
 *       200:
 *         description: User banned successfully
 *       400:
 *         description: Cannot ban yourself or already banned
 *       403:
 *         description: Not authorized or target has higher role
 *       404:
 *         description: User is not a member
 */
router.post("/:id/bans", hasServerRole(["OWNER", "ADMIN"]), validate(banUserSchema), banUser);

/**
 * @swagger
 * /api/servers/{id}/bans/{userId}:
 *   delete:
 *     summary: Unban a user
 *     tags: [Servers]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Server ID
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: Banned user ID
 *     responses:
 *       200:
 *         description: User unbanned successfully
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Ban not found
 */
router.delete("/:id/bans/:userId", hasServerRole(["OWNER", "ADMIN"]), unbanUser);

/**
 * @swagger
 * /api/servers/{id}/bans:
 *   get:
 *     summary: List server bans
 *     tags: [Servers]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Server ID
 *     responses:
 *       200:
 *         description: List of bans
 *       403:
 *         description: Not authorized
 */
router.get("/:id/bans", hasServerRole(["OWNER", "ADMIN"]), getBans);

module.exports = router;
