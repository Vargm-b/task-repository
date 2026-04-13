const pool = require("../../core/database");

async function createAssignment({ class_id, title, description, max_score, due_date, fileData, fileName, fileMime }) {
    if (!class_id) throw new Error("class_id is required");
    if (!title || !title.trim()) throw new Error("title is required");
    if (!description || !description.trim()) throw new Error("description is required");
    if (max_score === undefined || max_score === null) throw new Error("max_score is required");
    if (typeof max_score !== "number" || max_score < 1) throw new Error("max_score must be a positive number");
    if (!due_date) throw new Error("due_date is required");

    const dueDateObj = new Date(due_date);
    if (isNaN(dueDateObj.getTime())) throw new Error("due_date must be a valid date");
    if (dueDateObj <= new Date()) throw new Error("due_date must be in the future");

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const result = await client.query(
            `INSERT INTO assignment (class_id, title, description, max_score, due_date, attachment_data, attachment_name, attachment_mime)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             RETURNING id, class_id, title, description, max_score, due_date, attachment_name, attachment_mime`,
            [class_id, title.trim(), description.trim(), max_score, dueDateObj, fileData, fileName, fileMime]
        );

        const newAssignment = result.rows[0];

        try {
            const enrollments = await client.query(
                `
                SELECT student_id FROM (
                    SELECT * FROM enrollment WHERE class_id = (
                        SELECT id FROM virtual_class WHERE id = $1
                    )
                ) AS res
                `,
                [class_id]
            );

            const students = enrollments.rows;

            if (students.length > 0) {
                const message = `Se ha creado una nueva tarea: ${newAssignment.title}`;
                const queryValues = [];
                const flatValues = [];
                let i = 1;

                students.forEach((row) => {
                    queryValues.push(`($${i++}, $${i++}, $${i++}, $${i++}, false, NOW())`);
                    flatValues.push(row.student_id, class_id, newAssignment.id, message);
                });

                await client.query(
                    `INSERT INTO notification (student_id, class_id, assignment_id, message, is_read, created_at)
                     VALUES ${queryValues.join(",")}`,
                    flatValues
                );

                console.log(`Notificaciones enviadas a ${students.length} estudiantes para la nueva tarea ${newAssignment.title}`);
            }
        } catch (notifError) {
            console.error("Error al enviar notificaciones:", notifError.message);
        }

        await client.query("COMMIT");
        return newAssignment;
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
}

async function getAssignmentById(id) {
    if (!id) {
        throw new Error("Assignment id is required");
    }

    const result = await pool.query(
        `SELECT a.id, a.title, a.description, a.due_date, a.max_score, a.class_id,
                vc.name AS class_name
         FROM assignment a
         LEFT JOIN virtual_class vc ON vc.id = a.class_id
         WHERE a.id = $1`,
        [id]
    );

    if (result.rows.length === 0) {
        throw new Error("Assignment not found");
    }

    return result.rows[0];
}

async function getAssignmentsByClass(class_id) {
    if (!class_id) {
        throw new Error("class_id is required");
    }

    const result = await pool.query(
        `SELECT id, class_id, title, description, max_score, due_date, attachment_name, attachment_mime
         FROM assignment
         WHERE class_id = $1
         ORDER BY due_date ASC`,
        [class_id]
    );

    return result.rows;
}

async function getAllAssignments() {
    const result = await pool.query(
        `SELECT id, class_id, title, description, max_score, due_date, attachment_name, attachment_mime
         FROM assignment
         ORDER BY due_date ASC`
    );

    return result.rows;
}

module.exports = {
    getAssignmentById,
    createAssignment,
    getAssignmentsByClass,
    getAllAssignments
};