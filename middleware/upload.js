const multer = require('multer');
const path = require('path'); // Import 'path' for file paths


// Set storage engine for Multer
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, '../public/files')); // Save files to /public/files
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname); // Append unique timestamp to the original file name
    }
});