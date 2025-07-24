const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

router.get('/', userController.home);
router.get('/about', userController.about);
router.get('/contact', userController.contact);
router.get('/dashboard', userController.dashboard);

router.get('/login', userController.login);
router.post('/login', userController.postlogin);
router.get('/signup', userController.signup);
router.post('/signup', userController.postsignup);
router.get('/logout', userController.logout);

module.exports = router;
