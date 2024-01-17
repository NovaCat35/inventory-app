const multer = require("multer");

const storage = multer.memoryStorage();
const multerUploads = multer({ storage: storage }).single("uploaded_file");

module.exports =  multerUploads;