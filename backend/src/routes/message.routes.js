const express = require("express");
const router = express.Router();
const {
  createMessage,
  getMessages,
  updateMessage,
  deleteMessage,
} = require("../controllers/message.controller");
const { verifyToken } = require("../middleware/auth");
const validate = require("../middleware/validate");
const { createMessageSchema, updateMessageSchema } = require("../validators/message.validator");

router.use(verifyToken);

/**
 * @swagger
 * /api/messages:
 *   post:
 *     summary: Create a new message
 *     tags: [Messages]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - channelId
 *             properties:
 *               content:
 *                 type: string
 *                 example: Hello, world!
 *               channelId:
 *                 type: string
 *                 description: Channel ID
 *     responses:
 *       201:
 *         description: Message created successfully
 *       400:
 *         description: Validation error
 *       403:
 *         description: Not a member of the server
 *       404:
 *         description: Channel not found
 */
router.post("/", validate(createMessageSchema), createMessage);

/**
 * @swagger
 * /api/messages/channel/{id}:
 *   get:
 *     summary: Get messages in a channel
 *     tags: [Messages]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Channel ID
 *     responses:
 *       200:
 *         description: List of messages
 *       403:
 *         description: Not a member of the server
 *       404:
 *         description: Channel not found
 */
router.get("/channel/:id", getMessages);

/**
 * @swagger
 * /api/messages/{id}:
 *   patch:
 *     summary: Update a message
 *     tags: [Messages]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Message ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: Updated message content
 *     responses:
 *       200:
 *         description: Message updated successfully
 *       403:
 *         description: Not the author
 *       404:
 *         description: Message not found
 */
router.patch("/:id", validate(updateMessageSchema), updateMessage);

/**
 * @swagger
 * /api/messages/{id}:
 *   delete:
 *     summary: Delete a message
 *     tags: [Messages]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Message ID
 *     responses:
 *       200:
 *         description: Message deleted successfully
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Message not found
 */
router.delete("/:id", deleteMessage);

module.exports = router;
