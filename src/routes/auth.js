const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/verify', authController.verifyWallet);

module.exports = router;
