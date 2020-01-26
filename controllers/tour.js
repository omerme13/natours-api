const fs = require('fs');

const tours = JSON.parse(fs.readFileSync(__dirname + './../dev-data/data/tours-simple.json'));

const getTours = (req, res) => {
    res.json({
        status: 'success',
        results: tours.length,
        data: { tours }
    })
};

const createTour = (req, res) => {
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newId }, req.body);
    tours.push(newTour);

    fs.writeFile('../dev-data/data/tours-simple.json', JSON.stringify(tours), err => {
        res.status(201).json({
            status: 'success',
            data: { tour: newTour }
        })
    })
};

const getTour = (req, res) => {
    const relevantTour = tours.find(tour => tour.id == req.params.id);

    if (!relevantTour) {
        res.status(404).json({status: 'fail', message: 'Not Found'})
    }

    res.json({
        status: 'success',
        data: {
            tour: relevantTour
        }
    })
};



const updateTour = (req, res) => {
    // the logic in this patch request is not implemented yet
    const relevantTour = tours.find(tour => tour.id == req.params.id);

    if (!relevantTour) {
        res.status(404).json({status: 'fail', message: 'Not Found'})
    }

    res.json({
        status: 'success',
        data: {
            tour: relevantTour
        }
    })
};

const deleteTour = (req, res) => {
    // the logic in this delete request is not implemented yet
    const relevantTour = tours.find(tour => tour.id == req.params.id);

    if (!relevantTour) {
        res.status(404).json({status: 'fail', message: 'Not Found'})
    }

    res.status(204).json({
        status: 'success',
        data: null
    })
};

module.exports = {
    getTours,
    createTour,
    getTour,
    updateTour,
    deleteTour
};