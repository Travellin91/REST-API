const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization");

    if (!token || !token.startsWith("Bearer ")) {
      throw new Error("Not authorized");
    }

    const tokenWithoutBearer = token.replace("Bearer ", "");
    const decodedToken = jwt.verify(tokenWithoutBearer, process.env.USER_TOKEN);

    const user = await User.findById(decodedToken.id);
    if (!user) {
      throw new Error("Not authorized");
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized" });
  }
};

module.exports = authMiddleware;
