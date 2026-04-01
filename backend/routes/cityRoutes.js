const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const cityController = require('../controllers/cityController');
const admin = require('../middleware/admin');

// @route   GET /api/cities
// @desc    Tüm şehirleri getir (arama, filtreleme, sıralama, sayfalama)
// @access  Public
router.get('/', cityController.getCities);

// @route   GET /api/cities/region/:region
// @desc    Bölgeye göre şehirleri getir
// @access  Public
router.get('/region/:region', cityController.getCitiesByRegion);

// @route   GET /api/cities/:id
// @desc    Tek şehir getir
// @access  Public
router.get('/:id', cityController.getCityById);

// @route   POST /api/cities
// @desc    Yeni şehir ekle
// @access  Private (Admin)
router.post(
  '/',
  admin,
  [
    check('name', 'Şehir adı zorunludur').not().isEmpty(),
    check('code', 'Plaka kodu zorunludur').isInt({ min: 1, max: 81 }),
    check('region', 'Bölge bilgisi zorunludur').isIn([
      'Marmara', 'Ege', 'Akdeniz', 'Karadeniz', 'İç Anadolu', 'Doğu Anadolu', 'Güneydoğu Anadolu'
    ]),
    check('latitude', 'Enlem bilgisi zorunludur').isFloat(),
    check('longitude', 'Boylam bilgisi zorunludur').isFloat(),
  ],
  cityController.createCity
);

// @route   PUT /api/cities/:id
// @desc    Şehir güncelle
// @access  Private (Admin)
router.put('/:id', admin, cityController.updateCity);

// @route   DELETE /api/cities/:id
// @desc    Şehir sil
// @access  Private (Admin)
router.delete('/:id', admin, cityController.deleteCity);

module.exports = router;
