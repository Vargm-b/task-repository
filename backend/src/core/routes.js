const express = require('express');
const router = express.Router();

const classRoutes = require('../modules/classes/class.routes');
const assignmentRoutes = require('../modules/assignments/assignment.routes');
const enrollmentRoutes = require('../modules/enrollments/enrollment.routes');

router.use('/classes', classRoutes);
router.use('/assignments', assignmentRoutes);
router.use('/enrollments', enrollmentRoutes);

module.exports = router;
