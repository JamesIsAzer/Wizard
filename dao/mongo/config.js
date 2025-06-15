require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log(`${new Date().toString()} Connection to MongoDB...`);
    mongoose.set('strictQuery', true);
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`${new Date().toString()} MongoDB connected!`);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;