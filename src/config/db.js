const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();
const url = process.env.DB_URL;

const connectDB = async () => {
    try {
        await mongoose.connect(url);
    } catch (error) {
        console.log("Database connection failed");
    }
}

module.exports = connectDB;
