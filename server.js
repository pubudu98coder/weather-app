const dotenv = require('dotenv');
const express = require('express');
const connectDB = require('./src/config/db');
const { default: mongoose } = require('mongoose');
const userRouter= require('./src/routes/userRoutes');
const errorHandler = require('./src/middleware/errorHandler');
const cron = require('node-cron');
const { sendWeatherReports } = require('./src/services/emailService');
const { updateWeatherForAllUsers } = require('./src/services/weatherService');

//env cofiguration
dotenv.config();

//connect database
connectDB();

//app cnfiguration
const app = express();
const port = process.env.PORT || 5050;

//built in middleware for json
app.use(express.json());

//api endpopints
app.use('/api/user', userRouter);

//global error handling middleware
app.use(errorHandler);


//'0 */1 * * *'
cron.schedule('* * * * *', () => {
    console.log("Fetching weather data...");
    updateWeatherForAllUsers();
});

//'1 */3 * * *'
cron.schedule('*/3 * * * *', () => {
    sendWeatherReports();
    console.log("Weather Emails sent");
});

mongoose.connection.once('open',() => {
    console.log("Database connection successfull");
    app.listen(port, () => {
        console.log(`Server started on http://localhost:${port}`)
    });
})
