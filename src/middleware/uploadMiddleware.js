const multer = require('multer');

// Store files in memory buffer instead of disk to send directly to Pinata
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit for std pinata upload
});

module.exports = upload;
