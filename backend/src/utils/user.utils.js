const bcrypt = require("bcryptjs");
const { prisma } = require("../config/database");

const SALT_ROUNDS = 10;

// Password: min 8 chars, at least 1 uppercase, 1 lowercase, 1 number
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {{ valid: boolean, message: string|null }}
 */
const validatePassword = (password) => {
  if (!password || password.length < 8) {
    return { valid: false, message: "Password must be at least 8 characters." };
  }
  if (!PASSWORD_REGEX.test(password)) {
    return {
      valid: false,
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, and one number.",
    };
  }
  return { valid: true, message: null };
};

/**
 * Hash a password
 * @param {string} password - Plain text password
 * @returns {Promise<string>} - Hashed password
 */
const hashPassword = (password) => bcrypt.hash(password, SALT_ROUNDS);

/**
 * Compare password with hash
 * @param {string} password - Plain text password
 * @param {string} hash - Hashed password
 * @returns {Promise<boolean>}
 */
const comparePassword = (password, hash) => bcrypt.compare(password, hash);

/**
 * Check if an email is already taken by another user
 * @param {string} email - Email to check
 * @param {string|null} excludeUserId - User ID to exclude from check (for updates)
 * @returns {Promise<boolean>} - True if email is taken
 */
const isEmailTaken = async (email, excludeUserId = null) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return false;
  return excludeUserId ? user.id !== excludeUserId : true;
};

/**
 * Check if a username is already taken by another user
 * @param {string} username - Username to check
 * @param {string|null} excludeUserId - User ID to exclude from check (for updates)
 * @returns {Promise<boolean>} - True if username is taken
 */
const isUsernameTaken = async (username, excludeUserId = null) => {
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) return false;
  return excludeUserId ? user.id !== excludeUserId : true;
};

module.exports = {
  validatePassword,
  hashPassword,
  comparePassword,
  isEmailTaken,
  isUsernameTaken,
};
