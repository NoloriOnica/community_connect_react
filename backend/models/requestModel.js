const db = require('../config/db');

exports.create = async (data) => {
    const { user_id, subject, request_date, venue, description, image_path } = data;
    const result = await db.query(
        `INSERT INTO requests 
         (user_id, subject, request_date, venue, description, image_path)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [user_id, subject, request_date, venue, description, image_path]
    );
    return result.rows[0];
};

exports.getAll = async () => {
    const result = await db.query('SELECT * FROM requests ORDER BY created_at DESC');
    return result.rows;
};

exports.getById = async (id) => {
    const result = await db.query('SELECT * FROM requests WHERE id = $1', [id]);
    return result.rows[0];
};

exports.updateStatus = async (id, data) => {
    const { status, reserved_by, completed_by } = data;
    const result = await db.query(
        `UPDATE requests SET 
         status = COALESCE($1, status),
         reserved_by = COALESCE($2, reserved_by),
         completed_by = COALESCE($3, completed_by),
         updated_at = NOW()
         WHERE id = $4 RETURNING *`,
        [status, reserved_by, completed_by, id]
    );
    return result.rows[0];
};

exports.delete = async (id) => {
    await db.query('DELETE FROM requests WHERE id = $1', [id]);
};
