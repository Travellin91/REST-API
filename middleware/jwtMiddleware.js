const jwt = require("jsonwebtoken");

const jwtMiddleware = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.USER_TOKEN);
    req.user = decodedToken;

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = jwtMiddleware;
