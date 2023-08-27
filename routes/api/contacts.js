const express = require("express");
const router = express.Router();
const contactsController = require("../../controllers/contacts");
const authMiddleware = require("../../middleware/authMiddleware");

router.get("/", authMiddleware, contactsController.getAll);

router.get("/:id", authMiddleware, contactsController.getOne);

router.post("/", authMiddleware, contactsController.create);

router.put("/:id", authMiddleware, contactsController.update);

router.patch("/:id/favorite", authMiddleware, contactsController.updateFavorite);

router.delete("/:id", authMiddleware, contactsController.remove);


module.exports = router;