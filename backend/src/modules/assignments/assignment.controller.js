
const { createAssignment, fetchAssignments } = require('./assignment.service');

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
//Endpoint GET para obtener tareas por clase
async function handleGetAssignments(req, res) {
    try {
        const { class_id } = req.params; // Sacamos el ID de la URL
        const assignments = await fetchAssignments(class_id);
        return res.status(200).json(assignments);
    } catch (error) {
        console.error('Error al obtener assignments:', error.message);
        return res.status(400).json({ error: error.message });
    }
}
//export actualizado
module.exports = { handleCreateAssignment, handleGetAssignments };
