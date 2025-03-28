// reservedListingsModel.js
const db = require('../config/db');

exports.getPendingListings = async (user_id) => {
  const query = `
    SELECT l.*, u.username AS poster_name 
    FROM listings l
    JOIN users u ON l.user_id = u.id
    WHERE l.reserved_by = $1 AND l.approved = 0
  `;
  const { rows } = await db.query(query, [user_id]);
  return rows;
};

exports.getApprovedListings = async (user_id) => {
  const query = `
    SELECT l.*, 
           u.username AS poster_name, 
           u.email AS poster_email, 
           u.phone AS poster_phone
    FROM listings l
    JOIN users u ON l.user_id = u.id
    WHERE l.reserved_by = $1 AND l.approved = 1 AND l.completed_by IS NULL
  `;
  const { rows } = await db.query(query, [user_id]);
  return rows;
};

exports.getCompletedListings = async (user_id) => {
  const query = `
    SELECT l.*, u.username AS poster_name
    FROM listings l
    JOIN users u ON l.user_id = u.id
    WHERE l.completed_by = $1 AND l.approved = 1
  `;
  const { rows } = await db.query(query, [user_id]);
  return rows;
};
