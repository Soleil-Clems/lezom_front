const express = require("express");
const router = express.Router();
const { getMe, getUser, updateMe, deleteMe, updatePicture } = require("../controllers/user.controller");
const { verifyToken } = require("../middleware/auth");
const validate = require("../middleware/validate");
const { updateMeSchema } = require("../validators/user.validator");
const { imageUpload, handleMulterError } = require("../middleware/upload");

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
 *         description: Current user profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
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
 *                 example: johndoe
 *               firstname:
 *                 type: string
 *                 example: John
 *               lastname:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               description:
 *                 type: string
 *                 example: Hello world
 *               password:
 *                 type: string
 *                 format: password
 *               currentPassword:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Validation error or email/username taken
 *       401:
 *         description: Unauthorized or incorrect current password
 *       404:
 *         description: User not found
 */
router.put("/me", verifyToken, validate(updateMeSchema), updateMe);

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
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.delete("/me", verifyToken, deleteMe);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user public profile
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User public profile
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.get("/:id", verifyToken, getUser);

/**
 * @swagger
 * /api/users/picture/{id}:
 *   patch:
 *     summary: Update user profile picture
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile picture updated successfully
 *       400:
 *         description: No file uploaded
 *       403:
 *         description: Can only update your own picture
 */
router.patch(
  "/picture/:id",
  verifyToken,
  imageUpload.single("file"),
  handleMulterError,
  updatePicture
);

module.exports = router;
