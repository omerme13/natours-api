const Tour = require('../models/tour');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const getTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findOne({ slug: req.params.slug}).populate({
        path: 'reviews',
        fields: 'review rating user'
    });

    if (!tour) {
        return next(new AppError('There is no tour with that name.', 404));
    }

    res.render('tour', {
        title: tour.name,
        tour
    });
});

const getOverview = catchAsync(async (req, res, next) => {
    const tours = await Tour.find();

    res.render('overview', {
        title: 'All Tours',
        tours
    });
});

const getLoginPage = (req, res) => {

    res.render('login', {
        title: 'Log into your account'
    });
}

module.exports = {
    getTour,
    getOverview,
    getLoginPage
};