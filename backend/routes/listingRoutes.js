const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const listingController = require('../controllers/listingController');

router.post('/', upload.single('image'), listingController.createListing);
router.get('/near', listingController.getListingsNear); 
router.get('/search', listingController.searchListings);


router.get('/', listingController.getAllListings);
router.get('/:id', listingController.getListingById);
router.put('/:id', listingController.updateListingStatus);
router.delete('/:id', listingController.deleteListing);



module.exports = router;
