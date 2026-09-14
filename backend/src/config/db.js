const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('MONGODB_URI is not set. Check your .env file (see .env.example).');
    process.exit(1);
  }

  try {
    mongoose.set('strictQuery', true);
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  }

  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected.');
  });
}

module.exports = connectDB;
