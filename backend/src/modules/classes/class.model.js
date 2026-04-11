const pool = require('../../core/database');

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

const createClass = async (classData) => {
    const { name, description, accessCode, teacherId } = classData;
    const query = `
        INSERT INTO virtual_class (name, description, access_code, teacher_id, created_at)
        VALUES ($1, $2, $3, $4, NOW())
        RETURNING *;
    `;
    const values = [name, description, accessCode, teacherId];
    try {
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw new Error('Error saving the class: ' + error.message);
    }
};

async function createClassWithGeneratedCode({ name, description, teacherId }) {
    const accessCode = await generateUniqueAccessCode();
    return await createClass({ name, description, accessCode, teacherId });
}

module.exports = {
    createClass,
    createClassWithGeneratedCode,
    generateUniqueAccessCode
};