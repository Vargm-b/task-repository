const { createAssignment } = require('./assignment.service');

async function handleCreateAssignment(req, res){
    try{
        const { class_id, title, description, max_score, due_date } = req.body;

        const fileData = req.file ? req.file.buffer : null;
        const fileName = req.file ? req.file.originalname : null;
        const fileMime = req.file ? req.file.mimetype : null;


        const newAssignment = await createAssignment({
            class_id, title, description, max_score, due_date, attachment_data: fileData, attachment_name: fileName, attachment_mime: fileMime
        });
        return res.status(201).json(newAssignment);
    }catch (error){
        console.error('Error al crear assignment:', error.message);
        return res.status(400).json({error: error.message});
    }
}

module.exports = { handleCreateAssignment };
