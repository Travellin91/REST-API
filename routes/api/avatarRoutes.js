const express = require("express");
const multer = require("multer");
const jimp = require("jimp");
const path = require("path");
const authMiddleware = require("../../middleware/authMiddleware");
const User = require("../../models/user");
const fs = require("fs/promises");

const router = express.Router();

const storage = multer.diskStorage({
  destination: "tmp",
  filename: (req, file, cb) => {
    const ext = path.parse(file.originalname).ext;
    cb(null, Date.now() + ext);
  },
});
const upload = multer({ storage });

router.patch(
  "/users/avatars",
  authMiddleware,
  upload.single("avatar"),
  async (req, res) => {
    try {
      const { file } = req;
      if (!file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const image = await jimp.read(file.path);
      await image.cover(250, 250).write(file.path);

      const newAvatarName = `${req.user._id}${path.parse(file.originalname).ext}`;
      const newAvatarPath = path.join(__dirname, "../../public/avatars", newAvatarName);
      await fs.rename(file.path, newAvatarPath);

      await User.findByIdAndUpdate(req.user._id, { avatarURL: `/avatars/${newAvatarName}` });

      res.json({ avatarURL: `/avatars/${newAvatarName}` });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
