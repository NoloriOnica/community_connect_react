// reservedListingsController.js
const reservedListingsModel = require('../models/reservedListingsModel');

exports.getReservedListings = async (req, res) => {
  const { type, user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ error: 'Missing user_id in query parameters' });
  }

  try {
    let listings;
    if (type === 'pending') {
      listings = await reservedListingsModel.getPendingListings(user_id);
    } else if (type === 'approved') {
      listings = await reservedListingsModel.getApprovedListings(user_id);
    } else if (type === 'completed') {
      listings = await reservedListingsModel.getCompletedListings(user_id);
    } else {
      return res.status(400).json({ error: 'Invalid type parameter. Must be one of: pending, approved, completed' });
    }
    res.json(listings);
  } catch (err) {
    console.error('Error fetching reserved listings:', err);
    res.status(500).json({ error: err.message });
  }
};
