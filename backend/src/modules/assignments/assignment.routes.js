const express = require('express');
const router = express.Router();
const { handleCreateAssignment } = require('./assignment.controller');

router.post('/', handleCreateAssignment);

module.exports = router;
