const express = require('express');
const groupController = require('../controllers/group');
const router = express.Router();
const { authenticate } = require('../middleware/auth');

router.get('/', groupController.getAllGroups);
router.post('/create', authenticate,groupController.createGroup);
router.post('/add-user', authenticate,groupController.addUserToGroup);
router.post('/send-message', authenticate, groupController.sendGroupMessage);
router.get('/:groupId/messages/since/:timestamp', authenticate, groupController.getGroupMessages);

module.exports = router;
