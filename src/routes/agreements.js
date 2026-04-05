const express = require('express');
const router = express.Router();
const agreementController = require('../controllers/agreementController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, agreementController.createAgreement);
router.get('/', authMiddleware, agreementController.getAgreementsByWallet);
router.get('/wallet/:addr', agreementController.getAgreementsByWallet);
router.get('/:id', agreementController.getAgreement);
router.patch('/:id/status', authMiddleware, agreementController.updateStatus);

module.exports = router;
