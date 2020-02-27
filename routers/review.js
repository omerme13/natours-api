const express = require("express");

const reviewController = require("../controllers/review");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router
    .route("/")
    .get(reviewController.getReviews)
    .post(
        authMiddleware.verifyToken,
        authMiddleware.restrictTo('user'),
        reviewController.createReview
    );

module.exports = router;
