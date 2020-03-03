const Tour = require('../models/tour');
const catchAsync = require('../utils/catchAsync');

const getTour = catchAsync(async (req, res) => {
    const tour = await Tour.findOne({ slug: req.params.slug}).populate({
        path: 'reviews',
        fields: 'review rating user'
    });

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

module.exports = {
    getTour,
    getOverview
};