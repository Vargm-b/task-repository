const express = require('express');
const router = express.Router();
//importación actualizada 
const { handleCreateAssignment, handleGetAssignments } = require('./assignment.controller');

router.post('/', handleCreateAssignment);
//nueva ruta
router.get('/:class_id', handleGetAssignments);

module.exports = router;
