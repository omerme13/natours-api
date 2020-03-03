const express = require('express');

const viewController = require('../controllers/view');

const router = express.Router();

router.get('/tour/:slug', viewController.getTour);
router.get('/', viewController.getOverview);

module.exports = router;    
