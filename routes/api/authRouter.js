const express = require("express");
const authController = require("../../controllers/authController");

const router = express.Router();

router.post("/users/register", authController.registerUser);
router.post("/users/login", authController.loginUser);

module.exports = router;
