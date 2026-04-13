const { createClass, getClasses } = require('./class.service');

async function handleCreateClass(req, res) {
    try {
        const { name, description, teacher_id } = req.body;

        const newClass = await createClass({
            name,
            description,
            teacher_id
        });

        return res.status(201).json(newClass);
    } catch (error) {
        console.error('Error al crear class:', error.message);
        return res.status(400).json({ error: error.message });
    }
}

async function handleGetClasses(req, res) {
    try {
        const classes = await getClasses();
        return res.status(200).json(classes);
    } catch (error) {
        console.error('Error al obtener clases:', error.message);
        return res.status(500).json({ error: 'No se pudieron obtener las clases' });
    }
}

module.exports = {
    handleCreateClass,
    handleGetClasses
};