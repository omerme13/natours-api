const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// ****************
// HELPER FUNCTIONS
// ****************

const filterObj = (obj, ...whiteList) => {
    for (let key in obj) {
        if (whiteList.includes(key)) {
            continue;
        } else {
            delete obj[key];
        }
    }

    return obj;
};

// ****************
// ****************
// ****************

const getUsers = catchAsync(async (req, res, next) => {
    const users = await User.find();

    res.json({
        status: 'success',
        results: users.length,
        data: {
            users
        }
    });
});

const createUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "This route is not defined yet."
    });
};

const getUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "This route is not defined yet."
    });
};

const updateUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "This route is not defined yet."
    });
};

const deleteUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "This route is not defined yet."
    });
};

const updateMe = catchAsync(async (req, res, next) => {
    if (req.body.password || req.body.confirmPassword) {
        return next(new AppError('You can\'t update the password here.', 400));
    }

    const filteredBody = filterObj(req.body, 'name', 'email');
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true
    });

    res.json({
        status: 'success',
        data: {
            user: updatedUser
        }
    })
});

const deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
        status: 'success',
        data: null
    });
});

module.exports = {
    getUsers,
    createUser,
    getUser,
    updateUser,
    deleteUser,
    updateMe,
    deleteMe
};
