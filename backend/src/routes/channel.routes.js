const express = require("express");
const router = express.Router();
const {
  createChannel,
  getChannels,
  getChannel,
  updateChannel,
  deleteChannel,
} = require("../controllers/channel.controller");
const { verifyToken } = require("../middleware/auth");
const { isChannelMember, hasChannelRole } = require("../middleware/channel");
const validate = require("../middleware/validate");
const { createChannelSchema, updateChannelSchema } = require("../validators/channel.validator");

router.use(verifyToken);

/**
 * @swagger
 * /api/channels:
 *   post:
 *     summary: Create a new channel
 *     tags: [Channels]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - serverId
 *               - name
 *             properties:
 *               serverId:
 *                 type: string
 *                 description: Server ID
 *               name:
 *                 type: string
 *                 example: general
 *               description:
 *                 type: string
 *                 example: General discussion channel
 *     responses:
 *       201:
 *         description: Channel created successfully
 *       400:
 *         description: Validation error
 *       403:
 *         description: Not authorized
 */
router.post("/", validate(createChannelSchema), createChannel);

/**
 * @swagger
 * /api/channels/server/{serverId}:
 *   get:
 *     summary: List channels in a server
 *     tags: [Channels]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: serverId
 *         required: true
 *         schema:
 *           type: string
 *         description: Server ID
 *     responses:
 *       200:
 *         description: List of channels
 *       403:
 *         description: Not a member
 */
router.get("/server/:serverId", getChannels);

/**
 * @swagger
 * /api/channels/{id}:
 *   get:
 *     summary: Get channel details
 *     tags: [Channels]
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
 *         description: Channel details
 *       403:
 *         description: Not a member of the server
 *       404:
 *         description: Channel not found
 */
router.get("/:id", isChannelMember, getChannel);

/**
 * @swagger
 * /api/channels/{id}:
 *   put:
 *     summary: Update channel
 *     tags: [Channels]
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
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Channel updated
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Channel not found
 */
router.put("/:id", hasChannelRole(["OWNER", "ADMIN"]), validate(updateChannelSchema), updateChannel);

/**
 * @swagger
 * /api/channels/{id}:
 *   delete:
 *     summary: Delete channel
 *     tags: [Channels]
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
 *         description: Channel deleted
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Channel not found
 */
router.delete("/:id", hasChannelRole(["OWNER", "ADMIN"]), deleteChannel);

module.exports = router;
