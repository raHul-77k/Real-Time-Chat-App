const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const sequelize = require('./util/database');

const dotenv = require('dotenv');

// Load environment variables
dotenv.config();    


const app = express();

// Middleware
app.use(cors({
    origin: '*', // Update this as needed for your use case
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../frontend/public')));




// Sync database
sequelize.sync({force:false})
    .then(() => console.log('Database synced'))
    .catch(err => console.error('Error syncing database', err));

// Routes
const userRoutes = require('./routes/user');
const chatRoutes = require('./routes/chat');
const groupRoutes = require('./routes/group');



app.use('/user', userRoutes);
app.use('/chat', chatRoutes);
app.use('/group',groupRoutes);


// Home route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/signup.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


