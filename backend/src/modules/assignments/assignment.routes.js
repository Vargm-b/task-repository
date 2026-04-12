const express = require('express');
const router = express.Router();
const { handleCreateAssignment, handleGetAssignmentDetail} = require('./assignment.controller');

router.post('/', handleCreateAssignment);
// Nueva ruta para obtener el detalle de una tarea con validación de acceso (t08.3)
router.get('/detail/:assignment_id', handleGetAssignmentDetail);

module.exports = router;
