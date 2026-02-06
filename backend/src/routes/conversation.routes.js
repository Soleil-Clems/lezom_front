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

router.post("/", validate(createConversationSchema), createOrGet);
router.get("/", findAll);
router.get("/:id", findOne);
router.get("/:id/messages", findMessages);
router.post("/:id/messages", validate(createPrivateMessageSchema), createMessage);
router.patch("/messages/:id", validate(updatePrivateMessageSchema), updateMessage);
router.delete("/messages/:id", deleteMessage);

module.exports = router;
