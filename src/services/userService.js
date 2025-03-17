const User = require("../models/User");
const AppError= require("../utils/AppError");
const userSchema = require("../utils/validators/userValidatorSchema");
const bcrypt = require('bcrypt');
const axios = require('axios');
const { Client } = require('@googlemaps/google-maps-services-js');


const addUser = async (userData) => {
    const user = userSchema.validate(userData)?.value;
    console.log("user", user)
    const email = user.email;

    const exist = await User.findOne({email});
    if (exist) {
        throw new AppError("User email already exists", 409);
    } 

    //encrypt the password
    const salt = await bcrypt.genSalt(10);
    const hashPW = await bcrypt.hash(user.password, salt);

    const location = await getCordinates(user.location);

    //get city using google geocoding API
    const city = await getCityFromCordinates(location.latitude, location.longitude);

    console.log("city",city)

    const newUser = new User({
        email: user.email,
        password: hashPW,
        location: location,
        locationUrl: user.location,
        city: city
    });
    
    try {
        const savedUser = await newUser.save();
        return savedUser;    
    } catch (error) {
        console.log(error)
        throw new AppError("User registation failed", 500);
    }

}

const updateLocation = async (id, locationUrl) => {
    const location = await getCordinates(locationUrl);
    const user = await User.findOneAndUpdate({_id: id}, {location: location}, {new: true});
    if (!user) {
        throw new AppError("User not found with the ID", 409);
    }
    return {
        email: user.email,
        location: user.location
    };
}

const getWeatherDataByDay = async (id, date) => {

    const user = await User.findById(id);
    if (!user) {
        throw new AppError("User not found with the ID", 404);
    } 
    if (user?.weatherData.length === 0){
        throw new AppError("No weather data to display", 404);
    }
    const filteredWeatherData = user?.weatherData?.filter(
        data => new Date(data?.timeStamp).toISOString().split('T')[0] === date
    );

    return {id, date,filteredWeatherData};
}

const getCordinates = async (locationGoogleMapShortLink) => {
    let longUrl;
    try {
        //follow redirect to get full Url
        const response = await axios.get(locationGoogleMapShortLink, { maxRedirects: 5 });
        longUrl = response?.request?.res?.responseUrl;
    } catch (error) {
        if (error.status === 404 || error.message === 'Invalid URL') {
            throw new AppError("Invalid location urld", 404);
        } else {
            throw new AppError("Error getting long url", 500);
        }
    }  
        //extract the latitude
        const match1 = longUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/); 
        const match2 = longUrl.match(/search\/(-?\d+\.\d+),\+?(-?\d+\.\d+)/)   

        if (match1) {
            const latitude = parseFloat(match1[1]);
            const longitude = parseFloat(match1[2]);
            return {latitude, longitude};
        } else if (match2) {
            const latitude = parseFloat(match2[1]);
            const longitude = parseFloat(match2[2]);
            return {latitude, longitude};
        } else {
            throw new AppError("Coordinates are not in the url", 404);
        }
             
}

const getCityFromCordinates = async (latitude, longitude) => {
    const client = new Client({});
    const apiKey = process.env.GOOGLE_API_KEY;
    let response;
    try {
        response = await client.reverseGeocode({
            params: {
              latlng: { lat: latitude, lng: longitude },
              key: apiKey,
            },
        });

    } catch (error) {
        console.log(error)
        throw new AppError(error.response?.data.error_message, 500);
    }        

    //check there are any result
    if (response.data.results.length === 0) {
    throw new AppError("No results found", 404);
    }

    //find the city from the response
    const component = response.data.results[0].address_components.find((result) =>
        result.types.includes("locality")
    );

    if (component) {
        return component.long_name;
    } else {
        throw new AppError("City not found in the response.", 404);
    }

}

module.exports = {
    addUser, 
    updateLocation, 
    getWeatherDataByDay,
    getCityFromCordinates
}