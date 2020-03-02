const mongoose = require('mongoose');

const Tour = require('../models/tour');

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
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'user',
        select: '-__v -passwordChangedAt'
    });

    next();
});

reviewSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'user',
        select: 'name photo'
    });

    next();
});

reviewSchema.statics.calcAvgRatings = async function(tourId) {
    const stats = await this.aggregate([
        {
            $match: { tour: tourId }
        },
        {
            $group: {
                _id: '$tour',
                nRating: { $sum: 1 },
                avgRating: { $avg: '$rating' }
            }
        }
    ]); 

    if (stats.length) {
        await Tour.findByIdAndUpdate(tourId, {
            ratingAverage: stats[0].avgRating,
            ratingQuantity: stats[0].nRating
        });
    } else {
        await Tour.findByIdAndUpdate(tourId, {
            ratingAverage: 4.5,
            ratingQuantity: 0
        });
    }
};

// findByIdAndDelete
// findByIdAndUpdate
reviewSchema.pre(/^findOneAnd/, async function(next) {
    this.r = await this.findOne();

    next();
});

reviewSchema.post(/^findOneAnd/, async function() {
    // await this.findOne() does not work here because the query has already been executed so we needed to pass on the review doc via the "r" property 
    const curReviewDoc = this.r;

    await curReviewDoc.constructor.calcAvgRatings(curReviewDoc.tour);
});

reviewSchema.post('save', function() {
    this.constructor.calcAvgRatings(this.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;