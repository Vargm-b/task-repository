    const {createClass} = require('./class.service');

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

module.exports = {handleCreateClass};