const express = require('express');
const router = express.Router();
const multer = require('multer');
const { handleCreateAssignment } = require('./assignment.controller');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('attachment'), handleCreateAssignment);

module.exports = router;
