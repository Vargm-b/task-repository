const express = require('express');
const router = express.Router();
const multer = require('multer');

const { handleCreateAssignment, handleGetAssignmentById } = require('./assignment.controller');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('attachment'), handleCreateAssignment);

router.get('/:id', handleGetAssignmentById);


module.exports = router;
