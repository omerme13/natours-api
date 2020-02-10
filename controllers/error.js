const AppError = require('../utils/appError');

const handleCastErrorDb = err => {
    const message = `Invalid ${err.path}: ${err.value}`;

    return new AppError(message, 400);
}

const handledDuplicateFieldsDb = err => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const message = `Duplicate field value: ${value}. Please use another value.`;

    return new AppError(message, 400);
}

const handleValidationErrorDb = err => {
    const messagesArr = Object.values(err.errors).map(val => val.message);
    let message = `Invalid input data: ${messagesArr.join('. ')}.`;


    return new AppError(message, 400);
}


const sendErrDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
};

const sendErrProd = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    } else {
        console.error('error', err);

        res.status(500).json({
            status: 'error',
            message: 'Something went wrong.'
        })
    }
}

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        let error = {...err};

        if (error.name === 'CastError') {
            error = handleCastErrorDb(error);
        }
        if (error.code === 11000) {
            error = handledDuplicateFieldsDb(error);
        }
        if (error.name === 'ValidationError') {
            error = handleValidationErrorDb(error);
        }

        sendErrProd(error, res);
    }

    next();
};