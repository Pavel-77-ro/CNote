const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const { connectDB } = require('./config/db');
const noteRoutes = require('./routes/noteRoutes');
const folderRoutes = require('./routes/folderRoutes');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middleware/errorHandler');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

dotenv.config();

const app = express();

// Connect to the database only if not in test mode
if (process.env.NODE_ENV !== 'test') {
    connectDB();
}

// CORS Configuration
const corsOptions = {
    origin: [
        'http://localhost:3000', // Local frontend for development
        'https://www.cnoteweb.com', // Deployed frontend
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // Allow cookies if needed
};
app.use(cors(corsOptions));

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/notes', noteRoutes);
app.use('/api/folders', folderRoutes);
app.use('/api/auth', authRoutes);
app.use(errorHandler);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Default test route
app.get('/api', (req, res) => {
    res.json({ message: 'API is running!' });
});

// Only start the server if not in test mode
if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

// Export the app for testing
module.exports = app;
