const model = require('./class.model');

async function createClass({ name, description, teacher_id }) {
    if (!name || !name.trim() || !teacher_id || teacher_id == 0) throw new Error('Invalid name or teacher_id');
    const created = await model.createClassWithGeneratedCode({
        name,
        description: description || null,
        teacherId: teacher_id
    });
    return created;
}

module.exports = { createClass };