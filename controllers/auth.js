const jwt = require('jsonwebtoken');

const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const AppError  = require('../utils/appError');

const signToken = id => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRATION_TIME } 
    );
}

const signin = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return next(new AppError('Please provide email and password', 400));
    }

    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await user.isPasswordMatch(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }

    const token = signToken(user._id);

    res.json({
        status: 'success',
        token,
        data: { user }
    }); 
});

const signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create(req.body);
    const token = signToken(newUser._id);

    res.status(201).json({
        status: 'success',
        token,
        data: { user: newUser }
    }); 
});



module.exports = {
    signin,
    signup
};