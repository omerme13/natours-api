const Review = require('../models/review');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');

const getReviews = catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Review.find(), req.query)
        .filter()
        .sortBy()
        .limitFields()
        .paginate();

    const reviews = await features.query;

    res.json({
        status: 'success',
        results: reviews.length,
        data: { reviews }
    });    
});

const createReview = catchAsync(async (req, res, next) => {
    if (!req.body.tour) {
        req.body.tour = req.params.tourId;
    }
    if (!req.body.user) {
        req.body.user = req.user.id;
    }

    const newReview = await Review.create(req.body);

    res.status(201).json({
        status: 'success',
        data: { review: newReview }
    }); 
});

module.exports = {
    getReviews,
    createReview
}