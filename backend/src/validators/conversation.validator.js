const Joi = require("joi");

const createConversationSchema = Joi.object({
  userId: Joi.string().required().messages({
    "any.required": "User ID is required.",
  }),
});

const createPrivateMessageSchema = Joi.object({
  content: Joi.string().min(1).required().messages({
    "string.min": "Message content is required.",
    "any.required": "Message content is required.",
  }),
  type: Joi.string()
    .valid("text", "voice", "img", "file", "system", "gif")
    .default("text")
    .messages({
      "any.only": "Type must be text, voice, img, file, system, or gif.",
    }),
});

const updatePrivateMessageSchema = Joi.object({
  content: Joi.string().min(1).required().messages({
    "string.min": "Message content is required.",
    "any.required": "Message content is required.",
  }),
});

module.exports = {
  createConversationSchema,
  createPrivateMessageSchema,
  updatePrivateMessageSchema,
};
