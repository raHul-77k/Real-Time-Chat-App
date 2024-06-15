const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/signup', (req, res) => {
    res.sendFile(__dirname + '/../public/signup.html');
});

router.post('/signup', userController.signup);

module.exports = router;
