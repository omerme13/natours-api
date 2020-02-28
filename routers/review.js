const express = require("express");

const reviewController = require("../controllers/review");
const authMiddleware = require("../middleware/auth");
const reviewMiddleware = require("../middleware/review");

const router = express.Router({ mergeParams: true });

router
    .route('/')
    .get(reviewController.getReviews)
    .post(
        authMiddleware.verifyToken,
        authMiddleware.restrictTo('user'),
        reviewMiddleware.setTourUserId,
        reviewController.createReview
    );

router.route('/:id')
        //TODO authentication for this route
        .delete(reviewController.deleteReview)
        .get(reviewController.getReview)
        .patch(reviewController.updateReview);

module.exports = router;
