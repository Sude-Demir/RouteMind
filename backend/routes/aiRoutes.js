const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { generateRoute } = require('../controllers/aiController');

// @route   POST /api/ai/generate-route
// @desc    Yapay zeka ile kişiselleştirilmiş rota oluştur
// @access  Private
router.post('/generate-route', auth, generateRoute);

module.exports = router;
