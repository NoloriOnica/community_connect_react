const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const requestRoutes = require('./requestRoutes');
const listingRoutes = require('./listingRoutes');
const profileRoutes = require('./profileRoutes');
const reservedListingsRoutes = require('./reservedListingsRoutes');


router.use('/auth', authRoutes);
router.use('/requests', requestRoutes);
router.use('/listings', listingRoutes);
router.use('/profile', profileRoutes);
router.use('/reserved-listings', reservedListingsRoutes);


module.exports = router;
