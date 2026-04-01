const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Admin yetkisi kontrol middleware
module.exports = async function(req, res, next) {
  try {
    // Önce token doğrula
    const token = req.header('x-auth-token');

    if (!token) {
      return res.status(401).json({ msg: 'Token bulunamadı, yetkisiz erişim' });
    }

    const JWT_SECRET = process.env.JWT_SECRET || 'routemind_secret_key';
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.user;

    // Kullanıcının admin olup olmadığını kontrol et
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ msg: 'Bu işlem için admin yetkisi gerekli' });
    }

    next();
  } catch (err) {
    res.status(401).json({ msg: 'Geçersiz token' });
  }
};
