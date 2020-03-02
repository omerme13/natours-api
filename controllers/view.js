const Tour = require('../models/tour');
const catchAsync = require('../utils/catchAsync');

const getTour = (req, res) => {
    res.render('tour', {
        title: 'The Forest Hiker',
    });
}

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