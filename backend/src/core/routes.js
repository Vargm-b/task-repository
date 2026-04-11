const express = require('express');
const router = express.Router();

const classRoutes = require('../modules/classes/class.routes');
const assignmentRoutes = require('../modules/assignments/assignment.routes');

router.use('/classes', classRoutes);
router.use('/assignments', assignmentRoutes);

module.exports = router;
