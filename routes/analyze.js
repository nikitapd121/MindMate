const express = require('express');
const router = express.Router();
const { analyzeCode } = require('../controllers/deepseek');

router.post('/', analyzeCode);
module.exports = router;