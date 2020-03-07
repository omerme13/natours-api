const express = require('express');

const viewController = require('../controllers/view');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware.isLoggedIn);

router.get('/', authMiddleware.isLoggedIn, viewController.getOverview);
router.get('/tour/:slug', authMiddleware.isLoggedIn, viewController.getTour);
router.get('/login', authMiddleware.isLoggedIn, viewController.getLoginPage);
router.get('/me', authMiddleware.isLoggedIn, viewController.getAccount);

module.exports = router;    
