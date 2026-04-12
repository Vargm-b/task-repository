const model = require('./class.model');

async function createClass({name, description, teacher_id}){
    if(!name || !name.trim() || !teacher_id || teacher_id == 0) throw new Error('Invalid name or teacher_id');
    const access_code = await generateUniqueAccessCode();
    const result = await pool.query(
        `INSERT INTO classes (name, description, access_code, teacher_id)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
        [name, description || null, access_code, teacher_id]
    );
    return result.rows[0];
}

function _generateAccessCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

async function _accessCodeExists(accessCode) {
    const { rows } = await pool.query(
        'SELECT id FROM virtual_class WHERE access_code = $1 LIMIT 1',
        [accessCode]
    );
    return rows.length > 0;
}

async function generateUniqueAccessCode(maxAttempts = 10) {
    let attempts = 0;
    while (attempts < maxAttempts) {
        const code = _generateAccessCode();
        if (!/^[A-Z0-9]{6}$/.test(code)) {
            attempts++;
            continue;
        }
        const exists = await _accessCodeExists(code);
        if (!exists) return code;
        attempts++;
    }
    throw new Error('Unable to generate unique access code after ' + maxAttempts + ' attempts');
}



async function createClassWithGeneratedCode({ name, description, teacherId }) {
    const accessCode = await generateUniqueAccessCode();
    return await createClass({ name, description, accessCode, teacherId });
}

module.exports = {
    createClass,
    createClassWithGeneratedCode,
    generateUniqueAccessCode
};

//module.exports = { createClass };