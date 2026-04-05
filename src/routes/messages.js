const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/:id', authMiddleware, messageController.getMessages);
router.post('/', authMiddleware, messageController.postMessage);

module.exports = router;
