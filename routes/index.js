const express = require('express');
const router = express.Router();
const indexcontroller = require('../controllers/index');

router.get('/', indexcontroller.home);

module.exports = router;