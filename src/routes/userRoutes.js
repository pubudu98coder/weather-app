const express = require('express');
const { registerUser, updateWeather, updateUserLocation, getWeatherDataByDay } = require('../controllers/userController');

const userRouter = express.Router();
userRouter.post('/register', registerUser);
userRouter.patch('/update-weather', updateWeather);
userRouter.patch('/update-location/:id', updateUserLocation);
userRouter.get('/get-weather-data/:id/:date', getWeatherDataByDay);

module.exports = userRouter;