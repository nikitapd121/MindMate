const express = require('express');
const router = express.Router();
const memberController = require('../controllers/member');

router.get('/dashboard', memberController.dashboard);
router.get('/logout', memberController.logout);
router.get('/dsa', memberController.dsa);
router.get('/debug', memberController.debug);
router.get('/mvp',memberController.mvp );
router.get('/decisions',memberController.decision );

module.exports = router;
