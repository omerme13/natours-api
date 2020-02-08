const express = require('express');
const tourController = require('../controllers/tour');
const tourMiddleware = require('../middleware/tour');

const router = express.Router();

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router.route('/top-5-cheapest')
    .get(tourMiddleware.aliasTopTours, tourController.getTours);
    
router.route('/')
    .get(tourController.getTours)
    .post(tourController.createTour)
 
router.route('/:id')
    .get(tourController.getTour)
    .patch(tourController.updateTour)
    .delete(tourController.deleteTour)

module.exports = router;