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

module.exports = transport;
