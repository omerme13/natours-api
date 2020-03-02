const Tour = require('../models/tour');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');


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
});

const getToursWithin = catchAsync(async (req, res, next) => {
    const { distance, latLng, unit } = req.params;
    const [lat, lng] = latLng.split(',');
    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

    if (!lat || !lng) {
        next(new AppError('Please specify lat & lng separated by comma.', 400));
    }

    const tours = await Tour.find({
        startLocation: {
            $geoWithin: { $centerSphere: [[lng, lat], radius] }
        }
    });

    res.json({
        status: 'success',
        results: tours.length,
        data: {
            data: tours
        }
    });
});

const getDistances = catchAsync(async (req, res, next) => {
    const { latLng, unit } = req.params;
    const [lat, lng] = latLng.split(',');
    const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

    if (!lat || !lng) {
        next(new AppError('Please specify lat & lng separated by comma.', 400));
    }

    const distances = await Tour.aggregate([
        {
            $geoNear: {
                near: {
                    type: 'Point',
                    coordinates: [+lng, +lat]
                },
                distanceField: 'distance',
                distanceMultiplier: multiplier

            }
        },
        {
            $project: {
                name: 1,
                distance: 1
            } 
        }
    ]);

    res.json({
        status: 'success',
        data: {
            data: distances
        }
    });
});

module.exports = {
    getTours,
    createTour,
    getTour,
    updateTour,
    deleteTour,
    getTourStats,
    getMonthlyPlan,
    getToursWithin,
    getDistances
};