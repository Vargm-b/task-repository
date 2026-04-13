const {
    createAssignment,
    getAssignmentById,
    getAssignmentsByClass,
    getAllAssignments
} = require('./assignment.service');

async function handleCreateAssignment(req, res) {
    try {
        let { class_id, title, description, max_score, due_date } = req.body;
        max_score = parseInt(max_score, 10);

        const fileData = req.file ? req.file.buffer : null;
        const fileName = req.file ? req.file.originalname : null;
        const fileMime = req.file ? req.file.mimetype : null;

        const newAssignment = await createAssignment({
            class_id,
            title,
            description,
            max_score,
            due_date,
            fileData,
            fileName,
            fileMime
        });

        return res.status(201).json(newAssignment);
    } catch (error) {
        console.error("Error al crear assignment:", error.message);
        return res.status(400).json({ error: error.message });
    }
}

async function handleGetAssignmentById(req, res) {
    try {
        const { id } = req.params;
        const assignment = await getAssignmentById(id);
        return res.status(200).json(assignment);
    } catch (error) {
        console.error("Error al obtener tarea:", error.message);
        return res.status(404).json({ error: error.message });
    }
}

async function handleGetAssignments(req, res) {
    try {
        const { class_id } = req.query;

        if (class_id) {
            const assignments = await getAssignmentsByClass(class_id);
            return res.status(200).json(assignments);
        }

        const assignments = await getAllAssignments();
        return res.status(200).json(assignments);
    } catch (error) {
        console.error("Error al obtener tareas:", error.message);
        return res.status(400).json({ error: error.message });
    }
}

module.exports = {
    handleGetAssignmentById,
    handleCreateAssignment,
    handleGetAssignments
};