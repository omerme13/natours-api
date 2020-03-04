const express = require('express');

const viewController = require('../controllers/view');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware.isLoggedIn);

router.get('/', viewController.getOverview);
router.get('/tour/:slug', viewController.getTour);
router.get('/login', viewController.getLoginPage);

module.exports = router;    
