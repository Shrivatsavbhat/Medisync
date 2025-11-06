const mongoose = require('mongoose');
const multer = require('multer');

const connectDB = async () => {

    mongoose.connect('mongodb://127.0.0.1:27017/medisync')
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log('Error:',err));
};


module.exports = connectDB;