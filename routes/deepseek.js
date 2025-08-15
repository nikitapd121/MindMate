const express = require('express');
const router = express.Router();
const deepseekController = require('./controllers/deepseek');

router.post('/analyze', deepseekController.analyzeCode);

module.exports = router;