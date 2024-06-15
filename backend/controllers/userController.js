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
