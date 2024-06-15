const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const sequelize = require('./util/database');
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../frontend/public')));

// Sync database
sequelize.sync()
    .then(() => console.log('Database synced'))
    .catch(err => console.error('Error syncing database', err));

// Routes
const userRoutes = require('./routes/signup');
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
