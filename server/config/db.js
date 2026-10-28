const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hotelpro', {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`[Database] MongoDB connection error: ${error.message}`);
    console.warn(`[Database] Note: Ensure MongoDB service is running, or set MONGO_URI in .env`);
    return false;
  }
};

module.exports = connectDB;
