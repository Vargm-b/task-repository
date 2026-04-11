const pool = require('./../core/database');

async function joinClass({access_code,  student_id}){
    if(!access_code || !student_id){
        throw new Error('Access code and student_id are required');
    }

    const classResult = await pool.query(
        'SELECT id FROM classes WHERE access_code =  $1 LIMIT 1',
        [access_code]
    );

    if(classResult.rows.length === 0){
        throw new Error('Invalid access code');
    }

    const class_id= classResult.rows[0].id;

    const exitingEnrollment = await pool.query(
        'SELECT id FROM enrollment WHERE class_id =$1  AND student_id = $2 LIMIT 1',
        [class_id, student_id]
    );

    if(existingEnrollment.rows.length>0){
        throw new Error('Student is already enrolled in this class');
    }

    const enrollment = await pool.query(
        `INSERT INTO enrollment(class_id, student_id)
        VALUES($1,$2) RETURNING *`,
        [class_id, student_id]
    );

    return enrollment.rows[0];
}

module.exports = {joinClass};