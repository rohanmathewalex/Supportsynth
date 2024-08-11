const express = require('express');
const { handleFileUpload, handleQuery, handleUploadAndQuery } = require('../controllers/uploadController');
const router = express.Router();
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route for just uploading and analyzing a document
router.post('/upload', upload.single('file'), handleFileUpload);

// Route for querying after document upload
router.post('/query', handleQuery);

// Route for uploading a document and querying together
router.post('/upload-and-query', upload.single('file'), handleUploadAndQuery);

module.exports = router;
