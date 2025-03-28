const db = require('../config/db');

exports.findUserByUsername = async (username) => {
  const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
  return result.rows[0];
};

exports.createUser = async ({ username, passwordHash, email, phone, postalCode }) => {
  try {
    const result = await db.query(
      `INSERT INTO users (username, password_hash, email, phone, postal_code) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [username, passwordHash, email, phone, postalCode]
    );
    const newUser = result.rows[0];

    await db.query(
      `INSERT INTO user_stats (user_id) VALUES ($1)`,
      [newUser.id]
    );

    return newUser;
  } catch (err) {
    throw err;
  }
};


exports.updateOTP = async (userId, otpCode, expiresAt) => {
  await db.query(
    'UPDATE users SET otp_code = $1, otp_expires_at = $2 WHERE id = $3',
    [otpCode, expiresAt, userId]
  );
};

exports.verifyOTP = async (userId, otpCode) => {
  const result = await db.query(
    `SELECT * FROM users 
     WHERE id = $1 AND otp_code = $2 AND otp_expires_at > NOW()`,
    [userId, otpCode]
  );
  return result.rows[0];
};

exports.markUserAsVerified = async (userId) => {
  await db.query(
    'UPDATE users SET is_verified = true, otp_code = NULL, otp_expires_at = NULL WHERE id = $1',
    [userId]
  );
};
