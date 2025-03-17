const { default: axios } = require('axios');
const User = require('../models/User');
const AppError = require('../utils/AppError');

const fetchWeatherData = async (location) => {
    const {latitude, longitude} = location;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.OPEN_WEATHER_API_KEY}`;
    try {
        const response = await axios.get(url);
        return response?.data;
    } catch (error) {
        throw new AppError(error.message, error.status);
    }
}

const updateWeatherForAllUsers = async () => {
    const users = await User.find();
    for (let user of users) {
        const weatherData = await fetchWeatherData(user?.location);
        user?.weatherData.push({data: weatherData});
        const upUser = await user.save();
    }
}

module.exports = {updateWeatherForAllUsers};