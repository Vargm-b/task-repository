const express = require('express');
const router = express.Router();
const { handleCreateClass } = require('./class.controller');

router.post('/', handleCreateClass);

module.exports = router;