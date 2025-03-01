const multer = require("multer");

const storage = multer.memoryStorage(); // Store files in memory (needed for Cloudinary)
const upload = multer({ storage });

module.exports = upload;
