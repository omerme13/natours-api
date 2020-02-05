const Tour = require('../models/tour');

// HELPER FUNCTIONS
const filterTour = query => {
    const queryObj = {...query};
    const excluded = ['page', 'sort', 'limit', 'fields'];

    for (let exItem of excluded) {
        delete queryObj[exItem];
    }

    let queryStr = JSON.stringify(queryObj);

    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    const filteredQuery = Tour.find(JSON.parse(queryStr));

    return filteredQuery;
}

const sortBy = (query, sortStr) => {
    return sortStr
        ? query.sort(sortStr.split(',').join(' '))
        : query.sort('-createdAt');
}

const limitFields = (query, fieldsStr) => {
    return fieldsStr
        ? query.select(fieldsStr.split(',').join(' '))
        : query.select('-__v');
}

// CRUD FUNCTIONS
const getTours = async (req, res) => {
    try {
        let query = filterTour(req.query);
        query = sortBy(query, req.query.sort);
        query = limitFields(query, req.query.fields);

        const tours = await query;
    
        res.json({
            status: 'success',
            results: tours.length,
            data: { tours }
        });
    } catch (err) {
        console.log(err)
        res.json({
            status: 'fail',
            message: err
        });
    }

};

const createTour = async (req, res) => {
    try {
        const newTour = await Tour.create(req.body);

        res.status(201).json({
            status: 'success',
            data: { tour: newTour }
        })
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: 'Invalid data sent'
        });
    }

};

const getTour = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);

        res.json({
            status: 'success',
            data: { tour }
        });
    } catch (err) {
        res.json({
            status: 'fail',
            message: err
        });
    }
};



const updateTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.json({
            status: 'success',
            data: { tour }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
};

const deleteTour = async (req, res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id);

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
};

module.exports = {
    getTours,
    createTour,
    getTour,
    updateTour,
    deleteTour
};