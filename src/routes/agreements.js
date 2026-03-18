const express = require('express');
const router = express.Router();
const agreementController = require('../controllers/agreementController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, agreementController.createAgreement);
router.get('/:id', agreementController.getAgreement);
router.get('/wallet/:addr', authMiddleware, agreementController.getAgreementsByWallet);
router.put('/:id/status', authMiddleware, agreementController.updateStatus);

module.exports = router;
