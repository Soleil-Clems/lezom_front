const express = require("express");
const router = express.Router();
const { getMe, getUser, updateMe, deleteMe, updatePicture } = require("../controllers/user.controller");
const { verifyToken } = require("../middleware/auth");
const validate = require("../middleware/validate");
const { updateMeSchema } = require("../validators/user.validator");
const { imageUpload, handleMulterError } = require("../middleware/upload");

router.get("/me", verifyToken, getMe);
router.put("/me", verifyToken, validate(updateMeSchema), updateMe);
router.delete("/me", verifyToken, deleteMe);
router.get("/:id", verifyToken, getUser);
router.patch(
  "/picture/:id",
  verifyToken,
  imageUpload.single("file"),
  handleMulterError,
  updatePicture
);

module.exports = router;
