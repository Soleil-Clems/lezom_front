const bcrypt = require("bcryptjs");
const { prisma } = require("../config/database");

const SALT_ROUNDS = 10;

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
  hashPassword,
  comparePassword,
  isEmailTaken,
  isUsernameTaken,
};
