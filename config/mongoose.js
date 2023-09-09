require("dotenv").config({ path: "./mongo.env" });

const mongoose = require("mongoose");

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

module.exports = mongoose;
