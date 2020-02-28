const Tour = require('../models/tour');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

const createTour = factory.createOne(Tour);
const updateTour = factory.updateOne(Tour);
const deleteTour = factory.deleteOne(Tour);
const getTour = factory.getOne(Tour, 'reviews');
const getTours = factory.getAll(Tour);

const getTourStats = catchAsync(async (req, res, next) => {
    const stats = await Tour.aggregate([
        {
            $match: { ratingAverage: { $gte: 4.5 } },
        },
        {
            $group: {
                _id: { $toUpper: '$difficulty' },
                numTours: { $sum: 1 },
                numRatings: { $sum: '$ratingQuantity' },
                avgRating: { $avg: '$ratingAverage' },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' }
            }
        },
        {
            $sort: { avgPrice: 1 }
        }
    ]);
    
    res.json({
        status: 'success',
        data: { stats }
    })
});

const getMonthlyPlan = catchAsync(async (req, res, next) => {
    const year = +req.params.year;

    const plan = await Tour.aggregate([
        {
            $unwind: '$startDates'
        },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`)
                }
            }
        },
        {
            $group: {
                _id: { $month: '$startDates' },
                numTours: { $sum: 1 },
                tours: { $push: '$name'}
            }
        },
        {
            $addFields: { month: '$_id'}
        },
        {
            $project: { _id: 0 }
        },
        {
            $sort: { numTours: -1 }
        }
    ]);

    res.json({
        status: 'success',
        data: { plan }
    })
})

module.exports = {
    getTours,
    createTour,
    getTour,
    updateTour,
    deleteTour,
    getTourStats,
    getMonthlyPlan
};