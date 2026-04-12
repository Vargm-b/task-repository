const express = require('express');

const router = express.Router();

const {handleJoinClass} = require('./enrollment.controller');
router.post('/join', handleJoinClass);
module.exports = router;