const express = require('express');
const userController = require('../controllers/user');
const authController = require('../controllers/auth');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/signin', authController.signin);

router.post('/forgot-password', authController.forgotPassword);
router.patch('/reset-password/:token', authController.resetPassword);
router.patch('/update-password', authMiddleware.verifyToken, authController.updatePassword);

router.patch('/update-me', authMiddleware.verifyToken, userController.updateMe);
router.delete('/delete-me', authMiddleware.verifyToken, userController.deleteMe);

router.route('/')
    .get(userController.getUsers)
    .post(userController.createUser);
 
router.route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;    
