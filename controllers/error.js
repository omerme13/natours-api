const AppError = require('../utils/appError');

const handleCastErrorDb = err => {
    const message = `Invalid ${err.path}: ${err.value}`;

    return new AppError(message, 400);
};

const handledDuplicateFieldsDb = err => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const message = `Duplicate field value: ${value}. Please use another value.`;

    return new AppError(message, 400);
};

const handleValidationErrorDb = err => {
    const messagesArr = Object.values(err.errors).map(val => val.message);
    let message = `Invalid input data: ${messagesArr.join('. ')}.`;

    return new AppError(message, 400);
};

const handleJWTError = () => {
    return new AppError('Invalid Token. Please login again.', 401); 
};

const handleExpiredJWTError = () => {
    return new AppError('Your token has expired. Please login again.', 401); 
};

const sendErrDev = (err, req, res) => {
    if (req.originalUrl.startsWith('/api')) {
        res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        });
    } else {
        res.status(err.statusCode).render('error', {
            title: 'Something went wrong',
            msg: err.message
        });
    }
    
};

const sendErrProd = (err, req, res) => {
    if (req.originalUrl.startsWith('/api')) {
        if (err.isOperational) {
            res.status(err.statusCode).json({
                status: err.status,
                message: err.message
            });
        } else {
            res.status(500).json({
                status: 'error',
                message: 'Something went wrong.'
            })
        }

        return;
    }

    if (err.isOperational) {
        res.status(err.statusCode).render('error', {
            title: 'Something went wrong',
            msg: err.message
        });
    } else {
        res.status(err.statusCode).render('error', {
            title: 'Something went wrong',
            msg: 'Please try again later.'
        });
    }
};

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrDev(err, req, res);
    } else if (process.env.NODE_ENV === 'production') {
        let error = {
            ...err,
            message: err.message
        };

        if (error.name === 'CastError') {
            error = handleCastErrorDb(error);
        }
        if (error.code === 11000) {
            error = handledDuplicateFieldsDb(error);
        }
        if (error.name === 'ValidationError') {
            error = handleValidationErrorDb(error);
        }
        if (error.name === 'JsonWebTokenError') {
            error = handleJWTError();
        }
        if (error.name === 'TokenExpiredError') {
            error = handleExpiredJWTError();
        }

        sendErrProd(error, req, res);
    }

    next();
};