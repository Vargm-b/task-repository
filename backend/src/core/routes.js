const express = require('express');
const router = express.Router();

const classRoutes = require('../modules/classes/class.routes');

router.use('/classes', classRoutes);

module.exports = router;