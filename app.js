const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Joi = require("joi");
const contactsRouter = require("./routes/api/contacts");
const authRouter = require("./routes/api/authRouter");
require("dotenv").config({ path: "./mongo.env" }); 

const app = express();

app.use(cors());
app.use(express.json());

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
