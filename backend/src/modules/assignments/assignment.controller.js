const { createAssignment } = require('./assignment.service');

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

module.exports = { handleCreateAssignment };
