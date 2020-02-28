const express = require('express');

const tourController = require('../controllers/tour');
const tourMiddleware = require('../middleware/tour');
const authMiddleware = require('../middleware/auth');
const reviewRouter = require('../routers/review');

const router = express.Router();

router.use('/:tourId/reviews', reviewRouter);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router.route('/top-5-cheapest')
    .get(tourMiddleware.aliasTopTours, tourController.getTours);
    
router.route('/')
    .get(authMiddleware.verifyToken, tourController.getTours)
    .post(tourController.createTour);
 
router.route('/:id')
    .get(tourController.getTour)
    .patch(tourController.updateTour)
    .delete(
        authMiddleware.verifyToken,
        authMiddleware.restrictTo('lead-guide', 'admin'),
        tourController.deleteTour
    );
    
module.exports = router;