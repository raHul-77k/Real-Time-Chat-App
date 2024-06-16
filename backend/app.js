const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const sequelize = require('./util/database');
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json()); // Use bodyParser.json() for JSON payloads
app.use(express.static(path.join(__dirname, '../frontend/public')));

// Sync database
sequelize.sync()
    .then(() => console.log('Database synced'))
    .catch(err => console.error('Error syncing database', err));

// Routes
const userRoutes = require('./routes/user');
app.use('/user', userRoutes);

// Home route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/signup.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
