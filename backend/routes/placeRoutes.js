const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const placeController = require('../controllers/placeController');
const admin = require('../middleware/admin');

// @route   GET /api/places/featured
// @desc    Öne çıkan yerleri getir
// @access  Public
router.get('/featured', placeController.getFeaturedPlaces);

// @route   GET /api/places/meta/categories
// @desc    Tüm kategorileri getir
// @access  Public
router.get('/meta/categories', placeController.getCategories);

// @route   GET /api/places
// @desc    Tüm yerleri getir (arama, filtreleme, sıralama, sayfalama)
// @access  Public
router.get('/', placeController.getPlaces);

// @route   GET /api/places/slug/:slug
// @desc    Slug ile yer getir
// @access  Public
router.get('/slug/:slug', placeController.getPlaceBySlug);

// @route   GET /api/places/city/:cityId
// @desc    Şehre göre yerleri getir
// @access  Public
router.get('/city/:cityId', placeController.getPlacesByCity);

// @route   GET /api/places/category/:category
// @desc    Kategoriye göre yerleri getir
// @access  Public
router.get('/category/:category', placeController.getPlacesByCategory);

// @route   GET /api/places/:id
// @desc    ID ile tek yer getir
// @access  Public
router.get('/:id', placeController.getPlaceById);

// @route   POST /api/places
// @desc    Yeni yer ekle
// @access  Private (Admin)
router.post(
  '/',
  admin,
  [
    check('name', 'Yer adı zorunludur').not().isEmpty(),
    check('slug', 'Slug zorunludur').not().isEmpty(),
    check('city', 'Şehir bilgisi zorunludur').not().isEmpty(),
    check('country', 'Ülke bilgisi zorunludur').not().isEmpty(),
    check('category', 'Kategori zorunludur').isIn([
      'Tarihi', 'Doğa', 'Müze', 'Plaj', 'Cami', 'Kilise',
      'Park', 'Alışveriş', 'Yeme-İçme', 'Eğlence', 'Spor', 'Diğer'
    ]),
    check('latitude', 'Enlem bilgisi zorunludur').isFloat(),
    check('longitude', 'Boylam bilgisi zorunludur').isFloat(),
  ],
  placeController.createPlace
);

// @route   PUT /api/places/:id
// @desc    Yer güncelle
// @access  Private (Admin)
router.put('/:id', admin, placeController.updatePlace);

// @route   DELETE /api/places/:id
// @desc    Yer sil
// @access  Private (Admin)
router.delete('/:id', admin, placeController.deletePlace);

module.exports = router;
