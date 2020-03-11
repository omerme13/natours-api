const express = require("express");

const bookingController = require("../controllers/booking");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.use(authMiddleware.verifyToken);

router.get('/checkout-sessions/:tourId', bookingController.getCheckoutSession);

router.use(authMiddleware.restrictTo('admin', 'lead-guide'));

router.route('/')
    .get(bookingController.getBookings)
    .post(bookingController.createBooking)
 
router.route('/:id')
    .get(bookingController.getBooking)
    .patch(bookingController.updateBooking)
    .delete(bookingController.deleteBooking)

module.exports = router;