const Joi = require("joi");
const { passwordSchema } = require("./schemas");

const updateMeSchema = Joi.object({
  username: Joi.string().max(32).messages({
    "string.max": "Username must be at most 32 characters.",
  }),
  firstname: Joi.string().max(50).messages({
    "string.max": "Firstname must be at most 50 characters.",
  }),
  lastname: Joi.string().max(50).messages({
    "string.max": "Lastname must be at most 50 characters.",
  }),
  email: Joi.string().email().messages({
    "string.email": "Invalid email format.",
  }),
  description: Joi.string().max(500).allow("", null).messages({
    "string.max": "Description must be at most 500 characters.",
  }),
  img: Joi.string().max(500).allow("", null).messages({
    "string.max": "Image URL must be at most 500 characters.",
  }),
  password: passwordSchema,
  currentPassword: Joi.string().when("password", {
    is: Joi.exist(),
    then: Joi.required().messages({
      "any.required": "Current password is required to change password.",
    }),
  }),
})
  .min(1)
  .messages({
    "object.min": "No fields to update.",
  });

module.exports = { updateMeSchema };
