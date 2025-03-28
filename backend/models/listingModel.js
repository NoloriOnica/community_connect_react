// src/models/listingModel.js
const db = require('../config/db');
const oneMapAPI = require('../middleware/oneMapAPI');

exports.create = async (data) => {
  const { user_id, image_path, item_name, description, type, expiry_date, allergy } = data;
  const expiry = expiry_date === "" ? null : expiry_date;
  const result = await db.query(
    `INSERT INTO listings 
     (user_id, image_path, item_name, description, type, expiry_date, allergy)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [user_id, image_path, item_name, description, type, expiry, allergy]
  );
  return result.rows[0];
};


exports.getAll = async () => {
  const result = await db.query(`
    SELECT l.*, u.username AS poster_name, u.postal_code, l.user_id
    FROM listings l
    JOIN users u ON l.user_id = u.id
    ORDER BY l.created_at DESC
  `);
  return result.rows;
};

exports.getById = async (id) => {
  const result = await db.query(
    `
    SELECT l.*, u.username AS poster_name, u.postal_code, l.user_id
    FROM listings l
    JOIN users u ON l.user_id = u.id
    WHERE l.id = $1
  `,
    [id]
  );
  return result.rows[0];
};

exports.updateStatus = async (id, data) => {
  const { status, reserved_by, completed_by } = data;
  const result = await db.query(
    `UPDATE listings SET 
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
  await db.query('DELETE FROM listings WHERE id = $1', [id]);
};

exports.getListingsNear = async (userPostalCode, radius) => {
  // Get coordinates for the user's postal code.
  const userCoords = await oneMapAPI.getCoordinates(userPostalCode);
  console.log("User Coordinates:", userCoords);
  if (!userCoords) {
    throw new Error('Invalid user postal code');
  }

  // Get all listings (with poster info and postal codes)
  const result = await db.query(`
    SELECT l.*, u.username AS poster_name, u.postal_code, l.user_id
    FROM listings l
    JOIN users u ON l.user_id = u.id
  `);
  const listings = result.rows;

  // Cache for postal code coordinates.
  const postalCache = {};

  const filteredListings = [];
  for (const listing of listings) {
    const listingPostal = listing.postal_code;
    if (!listingPostal) continue;
    if (!postalCache[listingPostal]) {
      const coords = await oneMapAPI.getCoordinates(listingPostal);
      console.log("Listing Coordinates:", coords);
      postalCache[listingPostal] = coords;
    }
    const listingCoords = postalCache[listingPostal];
    if (!listingCoords) continue;
    const distance = calculateDistance(
      userCoords.lat,
      userCoords.lon,
      listingCoords.lat,
      listingCoords.lon
    );
    if (distance <= radius) {
      filteredListings.push({ ...listing, distance });
    }
  }
  return filteredListings;
};

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

exports.searchByTitle = async (searchTerm) => {
  const result = await db.query(
    `SELECT l.*, u.username AS poster_name, u.postal_code, l.user_id
     FROM listings l
     JOIN users u ON l.user_id = u.id
     WHERE LOWER(l.item_name) LIKE LOWER($1)
     ORDER BY l.created_at DESC`,
    [`%${searchTerm}%`]
  );
  return result.rows;
};

exports.incrementUserListings = async (userId) => {
  const result = await db.query(
    `UPDATE user_stats 
     SET total_listings_posted = total_listings_posted + 1, last_updated = NOW()
     WHERE user_id = $1`,
    [userId]
  );
  return result;
};
