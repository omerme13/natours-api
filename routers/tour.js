const express = require('express');

const tourController = require('../controllers/tour');
const reviewController = require('../controllers/review');
const tourMiddleware = require('../middleware/tour');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

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

router.route('/:tourId/reviews')
    .post(
        authMiddleware.verifyToken,
        authMiddleware.restrictTo('user'),
        reviewController.createReview
    )
    .get(reviewController.getReviews);
    
module.exports = router;