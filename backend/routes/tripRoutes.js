const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middleware/auth');
const {
  getTrips,
  getMyTrips,
  createTrip,
  joinTrip,
  leaveTrip,
  deleteTrip
} = require('../controllers/tripController');

// @route   GET /api/trips
// @desc    Tüm gezileri getir
// @access  Public
router.get('/', getTrips);

// @route   GET /api/trips/my
// @desc    Giriş yapan kullanıcının katıldığı gezileri getir
// @access  Private
router.get('/my', auth, getMyTrips);

// @route   POST /api/trips
// @desc    Yeni gezi oluştur
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('title', 'Gezi başlığı zorunludur').not().isEmpty(),
      check('destination', 'Varış noktası zorunludur').not().isEmpty(),
      check('description', 'Açıklama zorunludur').not().isEmpty(),
      check('startDate', 'Geçerli bir başlangıç tarihi girin').isISO8601().custom((value) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (new Date(value) < today) {
          throw new Error('Geçmiş bir tarihe plan yapılamaz');
        }
        return true;
      }),
      check('endDate', 'Geçerli bir bitiş tarihi girin').isISO8601().custom((value, { req }) => {
        if (new Date(value) < new Date(req.body.startDate)) {
          throw new Error('Bitiş tarihi başlangıç tarihinden önce olamaz');
        }
        return true;
      }),
      check('maxParticipants', 'Maksimum katılımcı sayısı en az 2 olmalıdır').isInt({ min: 2 }),
    ],
  ],
  createTrip
);

// @route   PUT /api/trips/:id/join
// @desc    Geziye katıl
// @access  Private
router.put('/:id/join', auth, joinTrip);

// @route   PUT /api/trips/:id/leave
// @desc    Geziden ayrıl
// @access  Private
router.put('/:id/leave', auth, leaveTrip);

// @route   DELETE /api/trips/:id
// @desc    Geziyi sil
// @access  Private
router.delete('/:id', auth, deleteTrip);

module.exports = router;
