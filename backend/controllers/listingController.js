// src/controllers/listingController.js
const listingModel = require('../models/listingModel');

exports.createListing = async (req, res) => {
  try {
    console.log("== Create Listing Request Received ==");
    console.log("Headers:", req.headers);
    console.log("req.body:", req.body);
    console.log("req.file:", req.file);

    const userId = req.headers['x-user-id'];
    console.log("userID:",userId)
    if (!userId) {
      console.log("User id not provided in header.");
      return res.status(400).json({ error: "User id header 'x-user-id' is required" });
    }

    // Convert empty expiry_date to null (if needed)
    const expiry = req.body.expiry_date === "" ? null : req.body.expiry_date;

    const data = {
      ...req.body,
      user_id: userId,
      image_path: req.file?.path || null,
      expiry_date: expiry,
    };
    console.log("Data to be inserted into DB:", data);

    const newListing = await listingModel.create(data);
    console.log("Listing created successfully:", newListing);

    await listingModel.incrementUserListings(userId);
    res.status(201).json(newListing);
  } catch (err) {
    console.error("Error in createListing:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getAllListings = async (req, res) => {
  try {
    const currentUserId = req.headers['x-user-id'];
    let listings = await listingModel.getAll();
    // Filter out listings created by the current user
    if (currentUserId) {
      listings = listings.filter(listing => listing.user_id != currentUserId);
    }
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getListingById = async (req, res) => {
  try {
    const listing = await listingModel.getById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    res.json(listing);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getListingsNear = async (req, res) => {
  try {
    const currentUserId = req.headers['x-user-id'];
    const { postal_code, radius } = req.query;
    if (!postal_code || !radius) {
      return res.status(400).json({ error: 'postal_code and radius are required' });
    }
    let listings = await listingModel.getListingsNear(postal_code, Number(radius));
    // Filter out the current user's listings
    if (currentUserId) {
      listings = listings.filter(listing => listing.user_id != currentUserId);
    }
    res.json(listings);
  } catch (err) {
    console.error("Error in getListingsNear:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateListingStatus = async (req, res) => {
  try {
    const updated = await listingModel.updateStatus(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteListing = async (req, res) => {
  try {
    await listingModel.delete(req.params.id);
    res.json({ message: 'Listing deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.searchListings = async (req, res) => {
  try {
    const currentUserId = req.headers['x-user-id'];
    const { title } = req.query;
    if (!title) {
      return res.status(400).json({ error: 'Title query parameter is required' });
    }
    let listings = await listingModel.searchByTitle(title);
    // Filter out listings created by the current user
    if (currentUserId) {
      listings = listings.filter(listing => listing.user_id != currentUserId);
    }
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

