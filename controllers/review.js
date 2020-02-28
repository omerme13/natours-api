const Review = require('../models/review');
const factory = require('./handlerFactory');

const createReview = factory.createOne(Review);
const updateReview = factory.updateOne(Review);
const deleteReview = factory.deleteOne(Review);
const getReview = factory.getOne(Review);
const getReviews = factory.getAll(Review);

module.exports = {
    getReviews,
    createReview,
    getReview,
    updateReview,
    deleteReview
}