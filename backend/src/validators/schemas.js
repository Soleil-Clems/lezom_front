const Joi = require("joi");

const passwordSchema = Joi.string()
  .min(8)
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
  .messages({
    "string.min": "Password must be at least 8 characters.",
    "string.pattern.base":
      "Password must contain at least one uppercase letter, one lowercase letter, and one number.",
  });

module.exports = { passwordSchema };
