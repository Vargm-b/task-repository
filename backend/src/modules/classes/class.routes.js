const express = require('express');
const router = express.Router();
const { handleCreateClass, handleGetTeacherClasses } = require('./class.controller');

router.post('/', handleCreateClass);

// Nueva ruta para obtener las clases de un docente específico 
// Cuando alguien entre a /teacher/:id, ejecutará el código
router.get('/teacher/:teacher_id', handleGetTeacherClasses);

module.exports = router;