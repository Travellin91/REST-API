const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/authMiddleware");
const authController = require("../../controllers/authController");
const upload = require("../../config/multerConfig");

router.post("/users/register", authController.registerUser);
router.post("/users/login", authController.loginUser);

router.patch(
  "/users/avatars",
  authMiddleware,
  upload.single("avatar"),
  authController.uploadAvatar
);

module.exports = router;
