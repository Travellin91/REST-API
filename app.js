const express = require("express");
const cors = require("cors");
const contactsRouter = require("./routes/api/contacts");
const authRouter = require("./routes/api/authRouter");
const authController = require("./controllers/authController");
const authMiddleware = require("./middleware/authMiddleware");
const mongoose = require("./config/mongoose"); 
const transport = require("./config/nodemailer"); 

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/api", contactsRouter);
app.use("/api", authRouter);

app.patch(
  "/api/users/avatars",
  authMiddleware,
  authController.uploadAvatar
);

app.get("/api/users/verify/:verificationToken", authController.verifyEmail);
app.post("/api/users/verify", authController.resendVerificationEmail);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
