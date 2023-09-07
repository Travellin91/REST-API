const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const contactsRouter = require("./routes/api/contacts");
const authRouter = require("./routes/api/authRouter");
const authController = require("./controllers/authController");
const authMiddleware = require("./middleware/authMiddleware");
require("dotenv").config({ path: "./mongo.env" });

const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  host: "smtp.meta.ua",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_EMAIL_ADDRESS,
    pass: process.env.SMTP_EMAIL_PASSWORD,
  },
});

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const uriDb = `mongodb+srv://${encodeURIComponent(process.env.DB_USERNAME)}:${encodeURIComponent(process.env.DB_PASSWORD)}@${process.env.DB_HOST}`;

mongoose
  .connect(uriDb, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connection successful");
  })
  .catch((error) => {
    console.error("Database connection error:", error);
    process.exit(1);
  });

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
