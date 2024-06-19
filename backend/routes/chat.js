const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { authenticate } = require('../middleware/auth');

router.post('/', authenticate, chatController.sendMessage);
router.get('/', authenticate, chatController.getMessages);

// New route to fetch messages since a specific timestamp
router.get('/since/:timestamp', authenticate, chatController.getMessagesSince);

module.exports = router;
