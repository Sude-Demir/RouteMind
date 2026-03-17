const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/authController');

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post(
  '/register',
  [
    check('name', 'İsim alanı zorunludur').not().isEmpty(),
    check('email', 'Lütfen geçerli bir e-posta adresi girin').isEmail(),
    check('password', 'Lütfen en az 6 karakterli bir şifre girin').isLength({ min: 6 }),
  ],
  authController.register
);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post(
  '/login',
  [
    check('email', 'Lütfen geçerli bir e-posta adresi girin').isEmail(),
    check('password', 'Şifre alanı zorunludur').exists(),
  ],
  authController.login
);

module.exports = router;
