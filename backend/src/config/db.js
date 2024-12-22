const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

const connectDB = async () => {
    try {
        if (process.env.NODE_ENV === 'test') {
            mongoServer = await MongoMemoryServer.create(); // Create in-memory MongoDB
            const uri = mongoServer.getUri();
            await mongoose.connect(uri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            console.log('Connected to in-memory MongoDB');
            return;
        }

        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(`Error: ${err.message}`);
        process.exit(1);
    }
};

const closeDB = async () => {
    if (mongoServer) {
        await mongoose.connection.dropDatabase(); // Clear in-memory database
        await mongoose.disconnect(); // Close Mongoose connection
        await mongoServer.stop(); // Stop in-memory server
    } else {
        await mongoose.disconnect(); // Disconnect from real database in non-test environments
    }
};

module.exports = { connectDB, closeDB };
