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
    check('password', 'Şifre en az 8 karakter olmalı, bir büyük harf, bir küçük harf, bir rakam ve bir özel karakter (@$!%*?&._-#/%^*+) içermelidir')
      .isLength({ min: 8 })
      .matches(/[a-zçğıöşü]/)
      .matches(/[A-ZÇĞİÖŞÜ]/)
      .matches(/[0-9]/)
      .matches(/[@$!%*?&._\-#/%^*+]/),
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
    check('password', 'E-posta veya şifre hatalı')
      .isLength({ min: 8 })
      .matches(/[a-zçğıöşü]/)
      .matches(/[A-ZÇĞİÖŞÜ]/)
      .matches(/[0-9]/)
      .matches(/[@$!%*?&._\-#/%^*+]/),
  ],
  authController.login
);

module.exports = router;
