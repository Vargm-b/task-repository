const pool = require('../../core/database');

async function createAssignment({ class_id, title, description, max_score, due_date }){
    if(!class_id) throw new Error('class_id is required');
    if(!title || !title.trim()) throw new Error('title is required');
    if(!description || !description.trim()) throw new Error('description is required');
    if(max_score === undefined || max_score === null) throw new Error('max_score is required');
    if(typeof max_score !== 'number' || max_score < 1) throw new Error('max_score must be a positive number');
    if(!due_date) throw new Error('due_date is required');

    const dueDateObj = new Date(due_date);
    if(isNaN(dueDateObj.getTime())) throw new Error('due_date must be a valid date');
    if(dueDateObj <= new Date()) throw new Error('due_date must be in the future');

    const result = await pool.query(
        `INSERT INTO assignment (class_id, title, description, max_score, due_date)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
        [class_id, title.trim(), description.trim(), max_score, dueDateObj]
    );
    return result.rows[0];
}
// Nueva función para obtener el detalle de una tarea con validación de acceso
async function getAssignmentDetail(assignment_id, student_id) {
    if (!assignment_id || !student_id) throw new Error('assignment_id and student_id are required');

    // 1. Obtenemos la tarea y de paso sabemos a qué clase pertenece
    const assignmentResult = await pool.query(
        'SELECT * FROM assignment WHERE id = $1',
        [assignment_id]
    );

    if (assignmentResult.rows.length === 0) {
        throw new Error('Assignment not found');
    }

    const assignment = assignmentResult.rows[0];

    // 2. Validamos la restricción: ¿El estudiante está inscrito en esta clase?
    const enrollmentResult = await pool.query(
        'SELECT id FROM enrollment WHERE class_id = $1 AND student_id = $2',
        [assignment.class_id, student_id]
    );

    if (enrollmentResult.rows.length === 0) {
        // Error de seguridad si no pertenece a la clase
        throw new Error('Access denied: You are not enrolled in this class');
    }

    // 3. Si todo está bien, devolvemos el detalle de la tarea
    return assignment;
}

module.exports = { createAssignment, getAssignmentDetail };
