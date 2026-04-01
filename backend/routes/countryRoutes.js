const express = require('express');
const router = express.Router();
const countryController = require('../controllers/countryController');

// @route   GET /api/countries
// @desc    Tüm ülkeleri getir
// @access  Public
router.get('/', countryController.getCountries);

// @route   GET /api/countries/:id
// @desc    Tek ülke getir
// @access  Public
router.get('/:id', countryController.getCountryById);

module.exports = router;
