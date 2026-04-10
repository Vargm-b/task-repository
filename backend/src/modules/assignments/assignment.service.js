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
        `INSERT INTO assignments (class_id, title, description, max_score, due_date)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
        [class_id, title.trim(), description.trim(), max_score, dueDateObj]
    );
    return result.rows[0];
}

module.exports = { createAssignment };
