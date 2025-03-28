// src/controllers/profileController.js
const profileModel = require('../models/profileModel');

exports.getUserProfile = async (req, res) => {
  try {
    const userInfo = await profileModel.getUserInfo(req.params.id);
    res.json(userInfo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateUserInfo = async (req, res) => {
  try {
    const updatedInfo = await profileModel.updateUserInfo(req.params.id, req.body);
    res.json(updatedInfo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserStats = async (req, res) => {
  try {
    const stats = await profileModel.getUserStats(req.params.id);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Listings endpoints
exports.getUserListings = async (req, res) => {
  try {
    const listings = await profileModel.getUserListings(req.params.id);
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Available Listings – only listings with status "available"
exports.getAvailableListings = async (req, res) => {
    try {
      const listings = await profileModel.getListingsByStatus(req.params.id, 'available');
      res.json(listings);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  

exports.getReservedListings = async (req, res) => {
  try {
    const listings = await profileModel.getListingsByStatus(req.params.id, 'reserved');
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPendingCompletionListings = async (req, res) => {
  try {
    const listings = await profileModel.getListingsByStatus(req.params.id, 'pending_completion');
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCompletedListings = async (req, res) => {
  try {
    const listings = await profileModel.getListingsByStatus(req.params.id, 'completed');
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ... other functions in profileController.js

// For reserved listings: Approve changes status to pending_completion
exports.approveListing = async (req, res) => {
    try {
      // Update status to 'pending_completion'
      const updated = await profileModel.updateListingStatus(req.params.id, 'pending_completion');
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  // For pending_completion listings: Mark as completed
  exports.completeListing = async (req, res) => {
    try {
      // Assume the client sends completed_by in the request body
      const updated = await profileModel.completeListing(req.params.id, req.body.completed_by);
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  // For pending_completion listings: Unreserve (go back to available)
  exports.unreserveListing = async (req, res) => {
    try {
      const updated = await profileModel.unreserveListing(req.params.id);
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  

exports.rejectListing = async (req, res) => {
  try {
    const updated = await profileModel.updateListingStatus(req.params.id, 'available');
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.editListing = async (req, res) => {
  try {
    const updated = await profileModel.editListing(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteListing = async (req, res) => {
  try {
    await profileModel.deleteListing(req.params.id);
    res.json({ message: 'Listing deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


