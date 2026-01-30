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
const { verifyToken } = require("../middleware/auth");
const { isMember, hasServerRole } = require("../middleware/server");
const validate = require("../middleware/validate");
const {
  createServerSchema,
  updateServerSchema,
  updateMemberRoleSchema,
  createInvitationSchema,
} = require("../validators/server.validator");

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
 *       401:
 *         description: Unauthorized
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
 *       401:
 *         description: Unauthorized
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Server updated
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Server not found
 */
router.put("/:id", hasServerRole(["OWNER", "ADMIN"]), validate(updateServerSchema), updateServer);

/**
 * @swagger
 * /api/servers/{id}:
 *   delete:
 *     summary: Delete server (Owner only)
 *     tags: [Servers]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Server deleted
 *       403:
 *         description: Not authorized
 */
router.delete("/:id", hasServerRole(["OWNER"]), deleteServer);

/**
 * @swagger
 * /api/servers/join/{code}:
 *   post:
 *     summary: Join server with invitation code
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
 *         description: Joined successfully
 *       400:
 *         description: Already a member or expired/maxed invitation
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
 *     summary: Leave server
 *     tags: [Servers]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Left server
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
 *     summary: List server members
 *     tags: [Servers]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of members
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
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
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
 *                 enum: [ADMIN, MEMBER]
 *     responses:
 *       200:
 *         description: Role updated
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Member not found
 */
router.put("/:id/members/:userId", hasServerRole(["OWNER", "ADMIN"]), validate(updateMemberRoleSchema), updateMemberRole);

/**
 * @swagger
 * /api/servers/{id}/members/{userId}:
 *   delete:
 *     summary: Kick member
 *     tags: [Servers]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Member kicked
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Member not found
 */
router.delete("/:id/members/:userId", hasServerRole(["OWNER", "ADMIN"]), kickMember);

/**
 * @swagger
 * /api/servers/{id}/transfer/{userId}:
 *   post:
 *     summary: Transfer ownership (Owner only)
 *     tags: [Servers]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ownership transferred
 *       403:
 *         description: Not the owner
 *       404:
 *         description: Member not found
 */
router.post("/:id/transfer/:userId", hasServerRole(["OWNER"]), transferOwnership);

/**
 * @swagger
 * /api/servers/{id}/invitations:
 *   post:
 *     summary: Create invitation
 *     tags: [Servers]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
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
 *                 description: Seconds until expiration
 *                 example: 86400
 *     responses:
 *       201:
 *         description: Invitation created
 *       403:
 *         description: Not authorized
 */
router.post("/:id/invitations", hasServerRole(["OWNER", "ADMIN"]), validate(createInvitationSchema), createInvitation);

/**
 * @swagger
 * /api/servers/{id}/invitations:
 *   get:
 *     summary: List invitations
 *     tags: [Servers]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
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
 *     summary: Delete invitation
 *     tags: [Servers]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: invitationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Invitation deleted
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Invitation not found
 */
router.delete("/:id/invitations/:invitationId", hasServerRole(["OWNER", "ADMIN"]), deleteInvitation);

module.exports = router;
