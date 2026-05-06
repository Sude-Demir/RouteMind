const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const commentController = require('../controllers/commentController');
const auth = require('../middleware/auth');

// @route   POST /api/comments/place/:placeId
// @desc    Mekana yorum ekle
// @access  Private
router.post(
  '/place/:placeId',
  auth,
  [
    check('rating', 'Puan vermek zorunludur').isNumeric({ min: 1, max: 5 }),
    check('text', 'Yorum metni zorunludur').not().isEmpty(),
  ],
  commentController.addComment
);

// @route   GET /api/comments/place/:placeId
// @desc    Mekanın yorumlarını getir
// @access  Public
router.get('/place/:placeId', commentController.getPlaceComments);

module.exports = router;
