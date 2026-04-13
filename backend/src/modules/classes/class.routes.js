const express = require('express');
const router = express.Router();
const {
    handleCreateClass,
    handleGetClasses
} = require('./class.controller');

router.get('/', handleGetClasses);
router.post('/', handleCreateClass);

module.exports = router;