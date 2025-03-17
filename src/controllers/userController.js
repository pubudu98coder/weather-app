const { addUser, updateLocation } = require("../services/userService");
const { updateWeatherForAllUsers } = require("../services/weatherService");
const userService = require('../services/userService')

const registerUser = async (req, res, next) => {
    try {
        const user = await addUser(req.body);
        res.status(201).json({success: true, user, message: "User added successfully"});
    } catch (error) {
        next(error);
    }
}

const updateWeather = async (req, res, next) => {
    try {
        await updateWeatherForAllUsers();
        res.status(200).json({success: true, message: "weather updated successfully"});
    } catch (error) {
        next(error);
    }
}

const updateUserLocation = async (req, res, next) =>{
    try {
        const {location} = req.body;
        const user = await updateLocation(req.params.id, location);
        res.status(200).json({success: true, user,message: "User location updated successfully"});
    } catch (error) {
        next(error);
    }
}

const getWeatherDataByDay = async (req, res, next) => {
    const {id, date} = req.params;

    try {
        const weatherData = await userService.getWeatherDataByDay(id, date);
        res.status(200).json({success: true, weatherData});
    } catch (error) {
        next(error);
    }
} 

module.exports = {
    registerUser,
    updateWeather,
    updateUserLocation,
    getWeatherDataByDay
}