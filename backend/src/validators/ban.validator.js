const Joi = require("joi");

const banUserSchema = Joi.object({
  userId: Joi.string().required().messages({
    "any.required": "User ID is required.",
  }),
  reason: Joi.string().max(500).allow("", null).messages({
    "string.max": "Reason must be at most 500 characters.",
  }),
});

module.exports = { banUserSchema };
