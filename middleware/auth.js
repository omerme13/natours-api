const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/user');

const getToken = (req, next) => {
    let token;

    if (
        req.headers.authorization && 
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {  // enabled by cookie-parser package
        token = req.cookies.jwt;
    }

    if (!token) {
        return next(new AppError('You need to login to get access.', 401));
    } else return token;
};

const verifyToken = catchAsync(async (req, res, next) => {
    const token = getToken(req, next);
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const authorizedUser = await User.findById(decoded.id);
    if (!authorizedUser) {
        return next(new AppError('The user is no longer exists.', 401));
    }

    if (authorizedUser.didChangePassword(decoded.iat)) {
        return next(new AppError(
            'The password recently changed. Please login again.', 401
        ));
    }

    // assigning the authorizedUser data to the req object allow the next middleware to access that data
    req.user = authorizedUser;

    next();
});

// only for rendered pages, no errors.
const isLoggedIn = async (req, res, next) => {
    try {

        if (!req.cookies.jwt) {
            return next();
        }
        
        const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
    
        const authorizedUser = await User.findById(decoded.id);
        if (!authorizedUser) {
            return next();
        }
    
        if (authorizedUser.didChangePassword(decoded.iat)) {
            return next();
        }
    
        // if it reaches this point it means there is a logged in user.
        res.locals.user = authorizedUser;
    
        next();
    } catch (err) {
        return next();
    }
};

const restrictTo = (...userRoles) => {
    return (req, res, next) => {
        const { role } = req.user;

        if (!userRoles.includes(role)) {
            return next(new AppError('Unauthorized action.', 403));
        }

        next();
    }
};

module.exports = {
    verifyToken,
    restrictTo,
    isLoggedIn
};