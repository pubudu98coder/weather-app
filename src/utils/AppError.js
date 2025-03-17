class AppError extends Error{
    constructor(message, statusCode) {
        super(message);
        this.statusCode  = statusCode;

        //capture the strack trace
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;