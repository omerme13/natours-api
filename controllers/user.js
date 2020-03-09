const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

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


const updateMe = catchAsync(async (req, res, next) => {
    if (req.body.password || req.body.confirmPassword) {
        return next(new AppError('You can\'t update the password here.', 400));
    }
    
    const filteredBody = filterObj(req.body, 'name', 'email');

    if (req.file) {
        filteredBody.photo = req.file.filename;
    }
    
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

const updateUser = factory.updateOne(User);
const deleteUser = factory.deleteOne(User);
const getUser = factory.getOne(User);
const getUsers = factory.getAll(User);

module.exports = {
    getUsers,
    getUser,
    updateUser,
    deleteUser,
    updateMe,
    deleteMe
};
