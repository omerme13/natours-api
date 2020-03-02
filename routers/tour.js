const express = require('express');

const tourController = require('../controllers/tour');
const tourMiddleware = require('../middleware/tour');
const authMiddleware = require('../middleware/auth');
const reviewRouter = require('../routers/review');

const router = express.Router();

router.use('/:tourId/reviews', reviewRouter);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(
    authMiddleware.verifyToken,
    authMiddleware.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.getMonthlyPlan
);

router.route('/top-5-cheapest')
    .get(tourMiddleware.aliasTopTours, tourController.getTours);
    
router.route('/tours-within/:distance/center/:latLng/unit/:unit')
    .get(tourController.getToursWithin);

router.route('/distances/:latLng/unit/:unit').get(tourController.getDistances);   
    
router.route('/')
    .get(tourController.getTours)
    .post(
        authMiddleware.verifyToken,
        authMiddleware.restrictTo('admin', 'lead-guide'),
        tourController.createTour
    );
 
router.route('/:id')
    .get(tourController.getTour)
    .patch(
        authMiddleware.verifyToken,
        authMiddleware.restrictTo('lead-guide', 'admin'),
        tourController.updateTour
    )
    .delete(
        authMiddleware.verifyToken,
        authMiddleware.restrictTo('lead-guide', 'admin'),
        tourController.deleteTour
    );
    
module.exports = router;