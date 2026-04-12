const pool = require('../../core/database');

function generateAcessCode(){
    return Math.random().toString(36).substring(2,8).toUpperCase();
}

async function generateUniqueAccessCode() {
    let accessCode;
    let exists = true;
    let attemps = 0;

    while(exists){
        if(attemps>=10){
            throw new Error('No se pudo generar un codigo único');
        }
        accessCode = generateAcessCode();
        attemps++;
        if(!/^[A-Z0-9]{6}$/.test(accessCode)) continue;
        const result = await pool.query(
            'SELECT id FROM virtual_class WHERE access_code = $1 LIMIT 1', [accessCode]
        );
        exists = result.rows.length > 0;
    }
    return accessCode;
}

async function createClass({name, description, teacher_id}){
    if(!name || !name.trim() || !teacher_id || teacher_id == 0) throw new Error('Invalid name or teacher_id');
    const access_code = await generateUniqueAccessCode();
    const result = await pool.query(
        `INSERT INTO virtual_class (name, description, access_code, teacher_id)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
        [name, description || null, access_code, teacher_id]
    );
    return result.rows[0];
}
// Función para obtener las clases de un docente específico
async function getClassesByTeacher(teacher_id){
    if(!teacher_id) throw new Error('teacher_id is required');
    
    // Consulta a virtual_class filtrando por el ID del docente
    const result = await pool.query(
        `SELECT id, name, description, access_code, teacher_id, created_at 
         FROM virtual_class 
         WHERE teacher_id = $1 
         ORDER BY created_at DESC`,
        [teacher_id]
    );
    return result.rows;
}
module.exports = { createClass, getClassesByTeacher };