const { createAssignment, getAssignmentDetail } = require('./assignment.service');

async function handleCreateAssignment(req, res){
    try{
        const { class_id, title, description, max_score, due_date } = req.body;

        const newAssignment = await createAssignment({
            class_id, title, description, max_score, due_date
        });
        return res.status(201).json(newAssignment);
    }catch (error){
        console.error('Error al crear assignment:', error.message);
        return res.status(400).json({error: error.message});
    }
}
// Nuevo controlador para obtener el detalle de una tarea con validación de acceso
async function handleGetAssignmentDetail(req, res) {
    try {
        const { assignment_id } = req.params;
        const { student_id } = req.query; 

        const assignment = await getAssignmentDetail(assignment_id, student_id);
        return res.status(200).json(assignment);
    } catch (error) {
        console.error('Error al obtener detalle:', error.message);
        const status = error.message.includes('Access denied') ? 403 : 400;
        return res.status(status).json({ error: error.message });
    }
}

module.exports = { handleCreateAssignment, handleGetAssignmentDetail };
