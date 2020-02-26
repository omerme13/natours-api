const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, 'A review cannot be empty.'],
        trim: true,
        maxlength: [256, 'A review name must have no more than 256 characters'],
        minlength: [8, 'A review name must have at least 8 characters']
    },
    rating: {
        type: Number,
        required: [true, 'A review must have a rating'],
        min: [1, 'The rating should between 1 and 5'],
        max: [5, 'The rating should between 1 and 5']
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'A review must belong to a user.']
    },
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'A review must belong to a tour.']
    }
},
{
    toJSON: { virtuals: true }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;