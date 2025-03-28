// src/models/profileModel.js
const db = require('../config/db');

exports.getUserInfo = async (userId) => {
  const result = await db.query(
    'SELECT id, username, email, phone, postal_code FROM users WHERE id = $1',
    [userId]
  );
  return result.rows[0];
};

exports.updateUserInfo = async (userId, data) => {
  const { username, email, phone, postal_code } = data;
  const result = await db.query(
    `UPDATE users SET username = COALESCE($1, username),
                       email = COALESCE($2, email),
                       phone = COALESCE($3, phone),
                       postal_code = COALESCE($4, postal_code)
     WHERE id = $5 RETURNING id, username, email, phone, postal_code`,
    [username, email, phone, postal_code, userId]
  );
  return result.rows[0];
};

exports.getUserStats = async (userId) => {
  const result = await db.query(
    'SELECT * FROM user_stats WHERE user_id = $1',
    [userId]
  );
  return result.rows[0];
};

exports.getUserListings = async (userId) => {
  const result = await db.query(`
    SELECT l.*, u.username AS poster_name, u.postal_code
    FROM listings l
    JOIN users u ON l.user_id = u.id
    WHERE l.user_id = $1
    ORDER BY l.created_at DESC
  `, [userId]);
  return result.rows;
};

// profileModel.js
exports.getListingsByStatus = async (userId, status) => {
    const result = await db.query(`
        SELECT l.*, 
               u.username AS poster_name, 
               u.postal_code, 
               ru.id AS reserved_by_id,
               ru.username AS reserved_by_name,
               cu.id AS completed_by_id,
               cu.username AS completed_by_name
        FROM listings l
        JOIN users u ON l.user_id = u.id
        LEFT JOIN users ru ON l.reserved_by = ru.id
        LEFT JOIN users cu ON l.completed_by = cu.id
        ORDER BY l.created_at DESC
      `);
      return result.rows;
  };
  
exports.editListing = async (id, data) => {
  const { item_name, description, type, expiry_date, allergy } = data;
  const result = await db.query(
    `UPDATE listings SET 
       item_name = COALESCE($1, item_name),
       description = COALESCE($2, description),
       type = COALESCE($3, type),
       expiry_date = COALESCE($4, expiry_date),
       allergy = COALESCE($5, allergy),
       updated_at = NOW()
     WHERE id = $6 RETURNING *`,
    [item_name, description, type, expiry_date, allergy, id]
  );
  return result.rows[0];
};

exports.updateListingStatus = async (id, status) => {
    let approved;
    if (status === "pending_completion") {
      approved = 1;
    } else if (status === "available") {
      approved = 0;
    }
    
    // If approved is defined then update that column too.
    if (approved !== undefined) {
      const result = await db.query(
        `UPDATE listings 
         SET status = $1, approved = $2, updated_at = NOW() 
         WHERE id = $3 RETURNING *`,
        [status, approved, id]
      );
      return result.rows[0];
    } else {
      const result = await db.query(
        `UPDATE listings 
         SET status = $1, updated_at = NOW() 
         WHERE id = $2 RETURNING *`,
        [status, id]
      );
      return result.rows[0];
    }
  };
  

exports.completeListing = async (id) => {
    const result = await db.query(
      `UPDATE listings 
       SET status = 'completed', completed_by = reserved_by, updated_at = NOW() 
       WHERE id = $1 RETURNING *`,
      [ id]
    );
    return result.rows[0];
  };
  
  exports.unreserveListing = async (id) => {
    const result = await db.query(
      `UPDATE listings 
       SET status = 'available', reserved_by = NULL, approved = 0, updated_at = NOW() 
       WHERE id = $1 RETURNING *`,
      [id]
    );
    return result.rows[0];
  };
  
  

exports.deleteListing = async (id) => {
  await db.query('DELETE FROM listings WHERE id = $1', [id]);
};