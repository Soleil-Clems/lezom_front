const express = require("express");
const router = express.Router();
const {
  createOrGet,
  findAll,
  findOne,
  findMessages,
  createMessage,
  updateMessage,
  deleteMessage,
} = require("../controllers/conversation.controller");
const { verifyToken } = require("../middleware/auth");
const validate = require("../middleware/validate");
const {
  createConversationSchema,
  createPrivateMessageSchema,
  updatePrivateMessageSchema,
} = require("../validators/conversation.validator");

router.use(verifyToken);

/**
 * @swagger
 * /api/conversations:
 *   post:
 *     summary: Create or get a conversation
 *     tags: [Conversations]
 *     security:
 *       - cookieAuth: []
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
 *                 description: Other user's ID
 *     responses:
 *       201:
 *         description: Conversation created or retrieved
 *       400:
 *         description: Cannot create conversation with yourself
 *       404:
 *         description: User not found
 */
router.post("/", validate(createConversationSchema), createOrGet);

/**
 * @swagger
 * /api/conversations:
 *   get:
 *     summary: List user's conversations
 *     tags: [Conversations]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of conversations
 */
router.get("/", findAll);

/**
 * @swagger
 * /api/conversations/{id}:
 *   get:
 *     summary: Get conversation details
 *     tags: [Conversations]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Conversation ID
 *     responses:
 *       200:
 *         description: Conversation details
 *       403:
 *         description: Not a participant
 *       404:
 *         description: Conversation not found
 */
router.get("/:id", findOne);

/**
 * @swagger
 * /api/conversations/{id}/messages:
 *   get:
 *     summary: Get conversation messages
 *     tags: [Conversations]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Conversation ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *     responses:
 *       200:
 *         description: Paginated messages
 *       403:
 *         description: Not a participant
 *       404:
 *         description: Conversation not found
 */
router.get("/:id/messages", findMessages);

/**
 * @swagger
 * /api/conversations/{id}/messages:
 *   post:
 *     summary: Send a message in a conversation
 *     tags: [Conversations]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Conversation ID
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
 *                 example: Hello!
 *               type:
 *                 type: string
 *                 enum: [text, voice, img, file, system, gif]
 *                 default: text
 *     responses:
 *       201:
 *         description: Message sent successfully
 *       403:
 *         description: Not a participant
 *       404:
 *         description: Conversation not found
 */
router.post("/:id/messages", validate(createPrivateMessageSchema), createMessage);

/**
 * @swagger
 * /api/conversations/messages/{id}:
 *   patch:
 *     summary: Update a private message
 *     tags: [Conversations]
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
 *                 example: Updated message
 *     responses:
 *       200:
 *         description: Message updated successfully
 *       403:
 *         description: Not the sender
 *       404:
 *         description: Message not found
 */
router.patch("/messages/:id", validate(updatePrivateMessageSchema), updateMessage);

/**
 * @swagger
 * /api/conversations/messages/{id}:
 *   delete:
 *     summary: Delete a private message
 *     tags: [Conversations]
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
 *         description: Not the sender
 *       404:
 *         description: Message not found
 */
router.delete("/messages/:id", deleteMessage);

module.exports = router;
