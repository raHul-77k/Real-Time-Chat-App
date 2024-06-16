const bcrypt = require('bcrypt');
const User = require('../models/User');

exports.signup = async (req, res) => {
    const { name, email, phone, password } = req.body;
    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).send('User already exists');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = await User.create({
            name,
            email,
            phone,
            password: hashedPassword
        });

        res.redirect('/user/login');
    } catch (error) {
        console.error('Error signing up:', error);
        res.status(500).send('Error signing up, please try again.');
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Check if the user exists
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).send('User not found, please sign up first');
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Incorrect password, please try again');
        }

        res.send('Successfully logged in');
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).send('Error logging in, please try again.');
    }
};
