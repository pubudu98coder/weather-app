const AppError = require("../utils/AppError");

const errorHandler = (error, req, res, next) => {
    console.log("Error",error);
    if (error.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            type:"ValidationError",
            details: error.details,
        });
    }

    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            success: false,
            message: error.message
        });
    }

    
    return res.status(500).json({
        success: false,
        message: "Internal server error"
    });
}

module.exports = errorHandler;