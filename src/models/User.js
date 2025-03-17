const mongoose = require("mongoose");
const { type } = require("../utils/validators/userValidatorSchema");
const { string } = require("joi");

const WeatherSchema = new mongoose.Schema({
    data: {type: Object},
    timeStamp: {type: Date, default: Date.now}
});

const UserSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    location: {type: Object, required: true},
    city: {type: String, required: true},
    locationUrl: {type: String, required: true},
    weatherData: [WeatherSchema]
});

module.exports = mongoose.model('User', UserSchema);