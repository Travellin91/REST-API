const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "tmp",
  filename: (req, file, cb) => {
    const ext = path.parse(file.originalname).ext;
    cb(null, Date.now() + ext);
  },
});

const upload = multer({ storage });

module.exports = upload;
