const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const requestController = require('../controllers/requestController');

router.post('/', upload.single('image'), requestController.createRequest);
router.get('/', requestController.getAllRequests);
router.get('/:id', requestController.getRequestById);
router.put('/:id', requestController.updateRequestStatus);
router.delete('/:id', requestController.deleteRequest);

module.exports = router;
