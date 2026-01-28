const express = require("express");
const router = express.Router();
const { getMe, updateMe, deleteMe } = require("../controllers/user.controller");
const { verifyToken } = require("../middleware/auth");

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized - no token provided
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get("/me", verifyToken, getMe);

/**
 * @swagger
 * /api/users/me:
 *   put:
 *     summary: Update current user profile
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: newusername
 *               firstname:
 *                 type: string
 *                 example: John
 *               lastname:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: newemail@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 description: New password (requires currentPassword)
 *                 example: newpassword123
 *               currentPassword:
 *                 type: string
 *                 format: password
 *                 description: Required when changing password
 *                 example: oldpassword123
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Profile updated successfully.
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: No fields to update, email/username already in use, or missing currentPassword
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized or incorrect current password
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.put("/me", verifyToken, updateMe);

/**
 * @swagger
 * /api/users/me:
 *   delete:
 *     summary: Delete current user account
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Account deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Account deleted successfully.
 *       401:
 *         description: Unauthorized - no token provided
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.delete("/me", verifyToken, deleteMe);

module.exports = router;
