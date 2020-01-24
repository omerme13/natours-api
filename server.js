const fs = require('fs');
const express = require('express');

const app = express();
app.use(express.json());

const tours = JSON.parse(fs.readFileSync('./dev-data/data/tours-simple.json'));

app.get('/api/v1/tours', (req, res) => {
    res.json({
        status: 'success',
        results: tours.length,
        data: { tours }
    })
});

app.get('/api/v1/tours/:id', (req, res) => {
    const relevantTour = tours.find(tour => tour.id == req.params.id);

    if (!relevantTour) {
        res.status(400).json({status: 'fail', message: 'Not Found'})
    }

    res.json({
        status: 'success',
        data: {
            tour: relevantTour
        }
    })
});

app.post('/api/v1/tours', (req, res) => {
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newId }, req.body);
    tours.push(newTour);

    fs.writeFile('./dev-data/data/tours-simple.json', JSON.stringify(tours), err => {
        res.status(201).json({
            status: 'success',
            data: { tour: newTour }
        })
    })
});

app.listen(3000, () => console.log('running on port 3000...'));