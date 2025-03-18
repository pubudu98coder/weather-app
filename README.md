# Weather Application

A Node.js application that fetches weather data for users, stores it in a MongoDB database, and sends weather reports via email. The application is hosted on Vercel.

---

## Features
- Fetches weather data using the **OpenWeather API**.
- Stores user and weather data in a **MongoDB database**.
- Sends weather reports via email using **Nodemailer** and Gmail's SMTP server.
- Uses **Google Geocoding API** to convert city names into geographic coordinates.
- Scheduled tasks using **cron** to fetch weather data and send emails periodically.

---

## Prerequisites
Before running the application, ensure you have the following:
1. **Node.js** installed (v16 or higher recommended).
2. A **MongoDB** database (local or cloud-based like MongoDB Atlas).
3. API keys for:
   - **OpenWeather API** (for weather data).
   - **Google Geocoding API** (for address-to-coordinate conversion).
4. A **Gmail account** with an app password for sending emails.

---

## Setup

### 1. Clone the Repository
```bash
git clone https://github.com/pubudu98coder/weather-app.git
cd weather-app
```

### 2. Install Dependencies
Install the required Node.js packages:
```bash
npm install
```
This will install all the dependencies listed in `package.json`, including:

### 3. Set Up Environment Variables
Create a `.env` file in the root directory and add the following variables:
```plaintext
PORT=5050
DB_URL=mongo_db_url/weather-app-db
OPEN_WEATHER_API_KEY=your_open_weather_api_key
EMAIL_USER=your_email@gmail.com
EMAIL_PW=your_app_password
GOOGLE_API_KEY=your_google_geocode_api_key
```
Replace the placeholders with your actual values:
- **DB_URL**: Your MongoDB connection URL (e.g., `mongodb+srv://username:password@cluster0.mongodb.net/weather-app-db`).
- **OPEN_WEATHER_API_KEY**: Your OpenWeather API key (sign up at OpenWeather).
- **EMAIL_USER**: Your Gmail address (e.g., `your-email@gmail.com`).
- **EMAIL_PW**: Your Gmail app password (generate one from your Google Account settings).
- **GOOGLE_API_KEY**: Your Google Geocoding API key (get it from the Google Cloud Console).

### 4. Run the Application
Start the server in development mode (with hot-reloading):
```bash
npm run dev
```
This uses `nodemon` to automatically restart the server when changes are made.

Start the server in production mode:
```bash
npm start
```
The application will be running at `http://localhost:5050`.

---

## Scripts
The following scripts are defined in `package.json`:
- `npm start`: Starts the server in production mode.
- `npm run dev`: Starts the server in development mode using `nodemon` for hot-reloading.
- `npm test`: Placeholder for running tests (currently not implemented).

---

## Environment Variables
The application uses the following environment variables:

| Variable Name         | Description                                      |
|----------------------|--------------------------------------------------|
| `PORT`               | Port on which the application runs (default: 5050). |
| `DB_URL`             | MongoDB connection URL.                         |
| `OPEN_WEATHER_API_KEY` | API key for the OpenWeather API.               |
| `EMAIL_USER`         | Email address used to send weather reports.     |
| `EMAIL_PW`           | App password for the email account.             |
| `GOOGLE_API_KEY`     | API key for the Google Geocoding API.           |

---

## Scheduled Tasks
The application uses `cron` to schedule two tasks:

### Fetch Weather Data:
- **Cron Expression**: `0 */1 * * *`
- **Description**: Runs every hour at the 0th minute.
- **Action**: Fetches weather data for all users and updates the database.
- **Example**: Runs at 12:00, 1:00, 2:00, etc.

### Send Weather Reports:
- **Cron Expression**: `1 */3 * * *`
- **Description**: Runs every 3 hours at the 1st minute.
- **Action**: Sends weather reports via email to all users.
- **Example**: Runs at 12:01, 3:01, 6:01, etc.
---

## Technologies Used
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **APIs**: OpenWeather API, Google Geocoding API
- **Email Service**: Nodemailer (Gmail SMTP)
- **Scheduling**: node-cron
- **Hosting**: Vercel

---



