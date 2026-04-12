const { createClass, getClassesByTeacher } = require('./class.service');

async function  handleCreateClass(req, res){
    try{
        const {name,  description, teacher_id} = req.body;

        const newClass = await createClass({
            name, description, teacher_id
        });
        return res.status(201).json(newClass);
    }catch (error){
        console.error('Error al crear class:', error.message);
        return res.status(400).json({error:error.message});
    }
}

async function handleGetTeacherClasses(req, res){
    try{
        const { teacher_id } = req.params; // Obtenemos el ID desde la URL
        const classes = await getClassesByTeacher(teacher_id);
        
        return res.status(200).json(classes);
    }catch (error){
        console.error('Error al obtener clases del docente:', error.message);
        return res.status(400).json({error: error.message});
    }
}

module.exports = { handleCreateClass, handleGetTeacherClasses };