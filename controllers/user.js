const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');

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

module.exports = {
    getUsers,
    createUser,
    getUser,
    updateUser,
    deleteUser
};
