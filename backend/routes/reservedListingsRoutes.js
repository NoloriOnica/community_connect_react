// reservedListingsRoutes.js
const express = require('express');
const router = express.Router();
const reservedListingsController = require('../controllers/reservedListingsController');

router.get('/', reservedListingsController.getReservedListings);

module.exports = router;
