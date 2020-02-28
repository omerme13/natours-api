const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');

const deleteOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
        return next(new AppError('no document found with that id.', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
});

const updateOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!doc) {
        return next(new AppError('No document found with that id', 404));
    }

    res.json({
        status: 'success',
        data: { data: doc }
    });
});

const createOne = Model => catchAsync(async (req, res, next) => {
    const newDoc = await Model.create(req.body);

    res.status(201).json({
        status: 'success',
        data: { data: newDoc }
    }); 
});

const getOne = (Model, populateOpt) => catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);

    if (populateOpt) {
        query = query.populate(populateOpt);
    }

    const doc = await query;

    if (!doc) {
        return next(new AppError('No document found with that id.', 404));
    }

    res.json({
        status: 'success',
        data: { data: doc }
    });
});

const getAll = Model => catchAsync(async (req, res, next) => {
    // when using nested get reviews on tours
    let reviewFilter = {};
    if (req.params.tourId) {
        reviewFilter = { tour: req.params.tourId };
    }

    const features = new APIFeatures(Model.find(reviewFilter), req.query)
        .filter()
        .sortBy()
        .limitFields()
        .paginate();

    const docs = await features.query;

    res.json({
        status: 'success',
        results: docs.length,
        data: { data: docs }
    });
});

module.exports = {
    deleteOne,
    updateOne,
    createOne,
    getOne,
    getAll
};