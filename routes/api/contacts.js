const express = require("express");
const router = express.Router();
const contactsController = require("../../controllers/contacts");
const authMiddleware = require("../../middleware/authMiddleware");

router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const contacts = await contactsController.getAll(userId);
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching contacts" });
  }
});

router.get("/:id", authMiddleware, async (req, res) => {
  const contactId = req.params.id;
  const userId = req.user.id;
  try {
    const contact = await contactsController.getOne(contactId, userId);
    if (!contact) {
      res.status(404).json({ message: "Contact not found" });
      return;
    }
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: "Error fetching contact" });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  const newContactData = req.body;
  const userId = req.user.id;
  try {
    const newContact = await contactsController.create(newContactData, userId);
    res.status(201).json(newContact);
  } catch (error) {
    res.status(500).json({ message: "Error creating contact" });
  }
});

router.put("/:id", authMiddleware, async (req, res) => {
  const contactId = req.params.id;
  const updatedContactData = req.body;
  const userId = req.user.id; 
  try {
    const updatedContact = await contactsController.update(contactId, updatedContactData, userId);
    res.json(updatedContact);
  } catch (error) {
    res.status(500).json({ message: "Error updating contact" });
  }
});

router.patch("/:id/favorite", authMiddleware, async (req, res) => {
  const contactId = req.params.id;
  const newFavoriteValue = req.body.favorite;
  const userId = req.user.id; 
  try {
    const updatedContact = await contactsController.updateFavorite(contactId, newFavoriteValue, userId);
    res.json(updatedContact);
  } catch (error) {
    res.status(500).json({ message: "Error updating contact's favorite status" });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  const contactId = req.params.id;
  const userId = req.user.id; 
  try {
    const deletedContact = await contactsController.remove(contactId, userId);
    res.json(deletedContact);
  } catch (error) {
    res.status(500).json({ message: "Error deleting contact" });
  }
});

module.exports = router;
