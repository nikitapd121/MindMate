const express = require('express');
const router = express.Router();
const memberController = require('../controllers/member');
const { body } = require('express-validator');

// Page routes
router.get('/dashboard', memberController.dashboard);
router.get('/logout', memberController.logout);
router.get('/dsa', memberController.dsa);
router.get('/mvp', memberController.mvp);
router.get('/decisions', memberController.decision);
router.get('/debug', memberController.debug);

// Debug API
router.post('/debug-api', memberController.debugCode);

module.exports = router;
