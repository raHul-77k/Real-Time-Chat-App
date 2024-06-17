const express = require('express');
const router = express.Router();
const path = require('path');
const userController = require('../controllers/userController');

router.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/public/signup.html'));
});

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/public/login.html'));
});

router.post('/signup', userController.signup); 
router.post('/login', userController.login); 

module.exports = router;
