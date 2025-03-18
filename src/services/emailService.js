const nodeMailer = require('nodemailer');
const User = require('../models/User');
const AppError = require('../utils/AppError');

const trasporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PW
    }
});

const sendWeatherReports = async () => {
    let users;
    try {
        users = await User.find();
    } catch (error) {
        throw new AppError("Error fetching user data", 500);
    }

    if (users.length === 0) {
        throw new AppError("Users not found", 404);
    }

    const now = new Date();
    const threeHoursAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000); // Subtract 3 hours

    for (let user of users) {
        //check user have weather data
        if (!user.weatherData || user.weatherData.length === 0) continue;

        //get the latst 3 weather reports
        const recentWeatherReports = user.weatherData.filter(report => 
            new Date(report.timeStamp) >= threeHoursAgo
        );


        let emailBody = `Hello!\nHere are your last 3 weather updates for user 📍location ${user.locationUrl}\n\n`;

        recentWeatherReports.forEach((report, index) => {
            const weather = report.data;
            const timeStamp = new Date(report.timeStamp).toISOString();
            const temperature = weather.main.temp;
            const description = weather.weather?.[0]?.description ?? "Unknown";

            emailBody += `📅 ${timeStamp}\n🌡 Temperature: ${temperature}°C\n🌤 Condition: ${description}\n\n`;
        });

        const mailOptions = {
            from: `"Weather Updates" <${process.env.EMAIL_USER}>`,
            to: user.email,
            replyTo: process.env.EMAIL_USER,
            subject: "Your Weather Report",
            text: emailBody, 
            html: `
                <html>
                    <head>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                background-color: #f4f4f4;
                                color: #333;
                                padding: 20px;
                            }
                            h1 {
                                font-size: 24px;
                                color: #1d72b8;
                            }
                            p {
                                font-size: 16px;
                                line-height: 1.5;
                            }
                            strong {
                                font-weight: bold;
                            }
                            ul {
                                list-style-type: none;
                                padding: 0;
                            }
                            li {
                                background-color: #ffffff;
                                margin: 10px 0;
                                padding: 10px;
                                border-radius: 5px;
                                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                            }
                            .weather-info {
                                margin-top: 10px;
                            }
                            .weather-info span {
                                font-size: 14px;
                                color: #555;
                            }
                            .date {
                                font-size: 16px;
                                font-weight: bold;
                                color: #333;
                            }
                            .temperature {
                                font-size: 16px;
                                color: #ff6600;
                            }
                            .condition {
                                font-size: 14px;
                                color: #28a745;
                            }
                            .footer {
                                margin-top: 20px;
                                text-align: center;
                                color: #999;
                            }
                            .location {
                                color: #1d72b8;
                                font-size: 18px;
                            }
                        </style>
                    </head>
                    <body>
                        <h1>Hello!</h1>
                        <p>Here are your last 3 weather updates for <strong>📍 Location: ${user.locationUrl}</strong></p>
                        <p>City: <strong>${user.city || 'Unknown City'}</strong></p>
                        <ul>
                            ${recentWeatherReports.map(report => `
                                <li>
                                    <div class="weather-info">
                                        <div class="date">📅 ${new Date(report.timeStamp).toLocaleString()}</div>
                                        <div class="temperature">🌡 Temperature: <strong>${(report.data.main.temp -273.15).toFixed(2)}°C</strong></div>
                                        <div class="condition">🌤 Condition: <strong>${report.data.weather?.[0]?.description ?? "Unknown"}</strong></div>
                                    </div>
                                </li>
                            `).join('')}
                        </ul>
                    </body>
                </html>
            `
        };

        try {
            await trasporter.sendMail(mailOptions);
            console.log(`Email sent to ${user.email}`)
        } catch (error) {
            throw new AppError(`Failed to send email to ${user.email}: ${error.message}`, 500);
        }
    }
}



module.exports = {sendWeatherReports};