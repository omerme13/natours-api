const express = require("express");

const reviewController = require("../controllers/review");
const authMiddleware = require("../middleware/auth");
const reviewMiddleware = require("../middleware/review");

const router = express.Router({ mergeParams: true });

// this middleware verifies that the user is authenticated. if this fails it won't get to the other middleware below.
router.use(authMiddleware.verifyToken);

router.route('/')
    .get(reviewController.getReviews)
    .post(
        authMiddleware.restrictTo('user'),
        reviewMiddleware.setTourUserId,
        reviewController.createReview
    );

router.route('/:id')
    .get(reviewController.getReview)
    .delete(authMiddleware.restrictTo('user', 'admin'), reviewController.deleteReview)
    .patch(authMiddleware.restrictTo('user', 'admin'), reviewController.updateReview);

module.exports = router;
