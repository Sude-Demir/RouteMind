const jwt = require('jsonwebtoken');

// Token doğrulama middleware
module.exports = function(req, res, next) {
  // Başlıkta (header) token var mı?
  const token = req.header('x-auth-token');

  // Token yoksa yetkisiz erişim hatası döndür
  if (!token) {
    return res.status(401).json({ msg: 'Token bulunamadı, yetkisiz erişim' });
  }

  try {
    // Sercret key ile doğrula
    const JWT_SECRET = process.env.JWT_SECRET || 'routemind_secret_key';
    const decoded = jwt.verify(token, JWT_SECRET);

    // İstek nesnesine kullanıcı bilgisini ekle
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Geçersiz token' });
  }
};
