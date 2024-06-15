const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./util/database');
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Sync database
sequelize.sync()
    .then(() => console.log('Database synced'))
    .catch(err => console.error('Error syncing database', err));

// Routes
const userRoutes = require('./routes/signup');
app.use('/user', userRoutes);

// Home route
app.get('/', (req, res) => {
    res.send('Welcome to the Group Chat Application');
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
