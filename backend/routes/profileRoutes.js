// src/routes/profileRoutes.js
const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');

// My Information
router.get('/:id/info', profileController.getUserProfile);
router.put('/:id/info', profileController.updateUserInfo);
router.get('/:id/stats', profileController.getUserStats);

// My Listings
router.get('/:id/listings/', profileController.getUserListings);// My Listings – Available
router.get('/:id/listings/available', profileController.getAvailableListings);

router.get('/:id/listings/reserved', profileController.getReservedListings);
router.get('/:id/listings/pending_completion', profileController.getPendingCompletionListings);
router.get('/:id/listings/completed', profileController.getCompletedListings);
router.put('/listing/:id/approve', profileController.approveListing);
router.put('/listing/:id/reject', profileController.rejectListing);
router.put('/listing/:id/edit', profileController.editListing);
router.delete('/listing/:id', profileController.deleteListing);

// For reserved listings: approve (moves to pending_completion)
router.put('/listing/:id/approve', profileController.approveListing);
// For reserved listings: reject (back to available)
router.put('/listing/:id/reject', profileController.rejectListing);
// New routes for pending_completion actions:
router.put('/listing/:id/complete', profileController.completeListing);
router.put('/listing/:id/unreserve', profileController.unreserveListing);

module.exports = router;
