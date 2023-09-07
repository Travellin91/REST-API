const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const gravatar = require("gravatar");
const User = require("../models/user");
const jimp = require("jimp");
const path = require("path");
const fs = require("fs/promises");
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config({ path: "./mongo.env" });

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const sendVerificationEmail = async (email, verificationToken) => {
  try {
    const transport = nodemailer.createTransport({
      host: "smtp.meta.ua",
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_EMAIL_ADDRESS,
        pass: process.env.SMTP_EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.SMTP_EMAIL_ADDRESS,
      to: email,
      subject: "Email Verification",
      text: `Please click the following link to verify your email: http://localhost:3000/api/users/verify/${verificationToken}`,
    };

    await transport.sendMail(mailOptions);
  } catch (error) {
    console.error(error);
  }
};

const registerUser = async (req, res) => {
  const { error } = registerSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: "Email in use" });
    }

    const verificationToken = uuidv4();

    const hashedPassword = await bcrypt.hash(password, 10);

    const avatarURL = gravatar.url(email, { s: "250", r: "pg", d: "mm" });

    const newUser = new User({
      email,
      password: hashedPassword,
      subscription: "starter",
      avatarURL,
      verificationToken,
    });

    await newUser.save();

    await sendVerificationEmail(email, verificationToken);

    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
        avatarURL: newUser.avatarURL,
      },
      token: jwt.sign({ id: newUser._id }, process.env.USER_TOKEN, {
        expiresIn: "1h",
      }),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const uploadAvatar = async (req, res) => {
  try {
    const { file } = req;
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const image = await jimp.read(file.path);
    await image.cover(250, 250).write(file.path);

    const newAvatarName = `${req.user._id}${path.parse(file.originalname).ext}`;
    const newAvatarPath = path.join(
      __dirname,
      "../public/avatars",
      newAvatarName
    );
    await fs.rename(file.path, newAvatarPath);

    await User.findByIdAndUpdate(req.user._id, {
      avatarURL: `/avatars/${newAvatarName}`,
    });

    res.json({ avatarURL: `/avatars/${newAvatarName}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const loginUser = async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.verify) {
      return res.status(401).json({ message: "Email not verified" });
    }

    res.json({
      user: {
        email: user.email,
        subscription: user.subscription,
        avatarURL: user.avatarURL,
      },
      token: jwt.sign({ id: user._id }, process.env.USER_TOKEN, {
        expiresIn: "1h",
      }),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;

  try {
    const user = await User.findOne({ verificationToken });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.verify = true;
    user.verificationToken = null;
    await user.save();

    return res.status(200).json({ message: "Verification successful" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const resendVerificationEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Missing required field email" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.verify) {
      return res
        .status(400)
        .json({ message: "Verification has already been passed" });
    }

    const verificationToken = uuidv4();

    user.verificationToken = verificationToken;
    await user.save();

    await sendVerificationEmail(email, verificationToken);

    res.status(200).json({ message: "Verification email sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  registerUser,
  uploadAvatar,
  loginUser,
  verifyEmail,
  resendVerificationEmail,
};
