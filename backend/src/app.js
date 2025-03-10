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
const cookieParser = require('cookie-parser');

dotenv.config();

const app = express();

if (process.env.NODE_ENV !== 'test') {
    connectDB();
}


const corsOptions = {
    origin: [
        'http://localhost:3000', 
        'https://www.cnoteweb.com', 
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
    credentials: true, 
};
app.use(cors(corsOptions));


app.use(cookieParser());
app.use(bodyParser.json());


app.use('/api/notes', noteRoutes);
app.use('/api/folders', folderRoutes);
app.use('/api/auth', authRoutes);
app.use(errorHandler);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));



app.get('/api', (req, res) => {
    res.json({ message: 'API is running!' });
});


if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
