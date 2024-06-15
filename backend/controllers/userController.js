const User = require('../models/User');

exports.signup = async (req, res) => {
    const { name, email, phone, password } = req.body;
    try {
        const newUser = await User.create({
            name,
            email,
            phone,
            password // Storing plain text password (not secure)
        });
        res.redirect('/user/login');
    } catch (error) {
        res.status(500).send('Error signing up, please try again.');
    }
};
