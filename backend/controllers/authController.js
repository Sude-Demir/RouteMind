const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// JWT_SECRET is added to .env, but fallback string here just in case for development only.
const JWT_SECRET = process.env.JWT_SECRET || 'routemind_secret_key';

const register = async (req, res) => {
  // Gelen verilerdeki kurallardan (validation) geçemeyen var mı?
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    // 1. Kullanıcı bu e-posta ile daha önceden kayıt olmuş mu?
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ errors: [{ msg: 'Bu e-posta adresi zaten kullanımda' }] });
    }

    // 2. Yeni Kullanıcı nesnesi oluştur
    user = new User({
      name,
      email,
      password,
    });

    // 3. Şifreyi Hash'leme (Gizleme)
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // 4. Kullanıcıyı MongoDB'ye kaydet
    await user.save();

    // Kayıt sonrası JWT token de oluşturulabilir ancak şimdilik login sayfasına yönlendirilecek
    res.status(201).json({ msg: 'Kullanıcı başarıyla kaydedildi', user: { id: user._id, name: user.name, email: user.email, role: user.role } });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Sunucu hatası');
  }
};

const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // 1. Kullanıcı var mı kontrol et
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ errors: [{ msg: 'Geçersiz e-posta veya şifre' }] });
    }

    // 2. Şifreler eşleşiyor mu (Girilen düz metin şifre ile veritabanındaki hashli şifre kıyaslaması)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: 'Geçersiz e-posta veya şifre' }] });
    }

    // 3. JWT Token (Giriş anahtarı) oluşturma
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: 360000 }, // Token'ın geçerlilik süresi
      (err, token) => {
        if (err) throw err;
        // Sunucu tokeni ve temel user bilgilerini döner
        res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Sunucu hatası');
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Sunucu Hatası');
  }
};

module.exports = {
  register,
  login,
  getMe
};
