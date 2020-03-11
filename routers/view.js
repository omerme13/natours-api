const express = require('express');

const viewController = require('../controllers/view');
const bookingController = require('../controllers/booking');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware.isLoggedIn);

router.get('/', bookingController.createBookingCheckout, authMiddleware.isLoggedIn, viewController.getOverview);
router.get('/tour/:slug', authMiddleware.isLoggedIn, viewController.getTour);
router.get('/login', authMiddleware.isLoggedIn, viewController.getLoginPage);
router.get('/me', authMiddleware.isLoggedIn, viewController.getAccount);
router.get('/my-tours', authMiddleware.verifyToken, viewController.getMyTours);

module.exports = router;    
