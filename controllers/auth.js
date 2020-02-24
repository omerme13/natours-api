const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const AppError  = require('../utils/appError');
const { sendEmail } = require('../utils/mail');

// ****************
// HELPER FUNCTIONS
// ****************
const signToken = id => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRATION_TIME } 
    );
};

const sendCookie = (res, token) => {
    res.cookie('jwt', token, {
        expires: new Date(
            Date.now() + 
            process.env.JWT_COOKIE_EXPIRATION_TIME * 24 * 60 * 60 * 1000
        ),
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true
    });
};

const sendCookieAndRespond = (res, user, token, statusCode) => {
    sendCookie(res, token);
    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: { user }
    }); 
};

const changeToNewPassword = async (req, next) => {
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');
        
    const user = await User.findOne({ 
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
        return next(new AppError('Token is invalid or expired', 400));
    }

    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    return user._id;
};

const authenticate = async (req, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError('Please provide email and password', 400));
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.isPasswordMatch(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }

    return {
        token: signToken(user._id),
        user
    };
};

// ****************
// ****************
// ****************

const signin = catchAsync(async (req, res, next) => {
    const { token, user } = await authenticate(req, next);

    sendCookieAndRespond(res, user, token, 200);
});

const signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create(req.body);
    const token = signToken(newUser._id);

    sendCookieAndRespond(res, newUser, token, 201);
});

const forgotPassword = catchAsync(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new AppError('This email address doesn\'t exist.', 404));
    }
    
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/reset-password/${resetToken}`;
    const message = `Did you forget your password? submit a request with your password and confirmation to ${resetUrl}`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Your password reset token(valid for 10 minutes)',
            message
        });
    
        res.json({
            status: 'success',
            message: 'Token sent to email'
        });
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpired = undefined;
        await user.save({ validateBeforeSave: false });
        
        return next(new AppError('Error sending the email. Please try again later.', 500));
    }
});

const resetPassword = catchAsync(async (req, res, next) => {
    const userId = await changeToNewPassword(req, next);
    const token = signToken(userId);

    res.json({
        status: 'success',
        token
    });     
});

const updatePassword = catchAsync(async (req, res, next) => {
    const data = await authenticate(req, next);
    
    if (!data) {
        return;
    }

    const { token, user } = data;

    user.password = req.body.newPassword;
    user.confirmPassword = req.body.newPasswordConfirm;
    await user.save();

    sendCookieAndRespond(res, user, token, 200);
});


module.exports = {
    signin,
    signup,
    forgotPassword,
    resetPassword,
    updatePassword
};