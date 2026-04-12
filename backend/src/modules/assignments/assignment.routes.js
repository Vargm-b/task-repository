const express = require('express');
const router = express.Router();
const { handleCreateAssignment, handleGetAssignmentById } = require('./assignment.controller');

router.post('/', handleCreateAssignment);
router.get('/:id', handleGetAssignmentById);

module.exports = router;
