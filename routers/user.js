const express = require('express');

const userController = require('../controllers/user');
const authController = require('../controllers/auth');
const authMiddleware = require('../middleware/auth');
const userMiddleware = require('../middleware/user');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/signin', authController.signin);
router.get('/logout', authController.logout);
router.post('/forgot-password', authController.forgotPassword);
router.patch('/reset-password/:token', authController.resetPassword);

// this middleware verifies that the user is authenticated. if this fails it won't get to the other middleware below.
router.use(authMiddleware.verifyToken);

router.patch('/update-password', authController.updatePassword);
router.patch('/update-me',
    userMiddleware.uploadUserPhoto,
    userMiddleware.resizeUserPhoto,
    userController.updateMe
);
router.delete('/delete-me', userController.deleteMe);
router.get('/me', userMiddleware.getMe, userController.getUser);

// this middleware verifies that the user is an admin. if not it won't get to the other middleware below.
router.use(authMiddleware.restrictTo('admin'));

router.get('/', userController.getUsers);

router.route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;    
