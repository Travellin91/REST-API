const express = require("express");
const router = express.Router();
const contactsController = require("../../controllers/contacts");

router.get("/contacts", async (req, res) => {
  try {
    const contacts = await contactsController.getAll();
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching contacts" });
  }
});

router.get("/contacts/:id", async (req, res) => {
  const contactId = req.params.id;
  try {
    const contact = await contactsController.getOne(contactId);
    if (!contact) {
      res.status(404).json({ message: "Contact not found" });
      return;
    }
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: "Error fetching contact" });
  }
});

router.post("/contacts", async (req, res) => {
  const newContactData = req.body;
  try {
    const newContact = await contactsController.create(newContactData);
    res.status(201).json(newContact);
  } catch (error) {
    res.status(500).json({ message: "Error creating contact" });
  }
});

router.put("/contacts/:id", async (req, res) => {
  const contactId = req.params.id;
  const updatedContactData = req.body;
  try {
    const updatedContact = await contactsController.update(contactId, updatedContactData);
    res.json(updatedContact);
  } catch (error) {
    res.status(500).json({ message: "Error updating contact" });
  }
});

router.patch("/contacts/:id/favorite", async (req, res) => {
  const contactId = req.params.id;
  const newFavoriteValue = req.body.favorite;
  try {
    const updatedContact = await contactsController.updateFavorite(contactId, newFavoriteValue);
    res.json(updatedContact);
  } catch (error) {
    res.status(500).json({ message: "Error updating contact's favorite status" });
  }
});

router.delete("/contacts/:id", async (req, res) => {
  const contactId = req.params.id;
  try {
    const deletedContact = await contactsController.remove(contactId);
    res.json(deletedContact);
  } catch (error) {
    res.status(500).json({ message: "Error deleting contact" });
  }
});

module.exports = router;
