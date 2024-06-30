const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const secretKey = 'secretKey'; // Use a secure key in production

const generateAccessToken = (userId) => {
    const payload = { userId };
    const options = { expiresIn: '1h' }; // Token expiration time
    return jwt.sign(payload, secretKey, options);
};

exports.signup = async (req, res) => {
    const { id, name, email, phone, password } = req.body;
    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).send('User already exists, Please Login');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            id,
            name,
            email,
            phone, 
            password: hashedPassword 
        });
        res.status(201).send('Successfully signed up');
    } catch (error) {
        res.status(500).send('Error signing up, please try again.');
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).send('User not found');
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).send('User not authorized');
        }
        const token = generateAccessToken(user.id); // Generating token using the function
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).send('Error logging in, please try again.');
    }
};