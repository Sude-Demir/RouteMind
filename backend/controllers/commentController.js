const Comment = require('../models/Comment');
const Place = require('../models/Place');
const { validationResult } = require('express-validator');

// @desc    Mekana yorum ekle
// @route   POST /api/comments/place/:placeId
// @access  Private
const addComment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { rating, title, text, imageUrl } = req.body;
    const placeId = req.params.placeId;
    const userId = req.user.id;

    // Mekan var mı kontrol et
    const place = await Place.findById(placeId);
    if (!place) {
      return res.status(404).json({ msg: 'Mekan bulunamadı' });
    }

    // Kullanıcı daha önce bu mekana yorum yapmış mı kontrol et
    const existingComment = await Comment.findOne({ user: userId, place: placeId });
    if (existingComment) {
      return res.status(400).json({ msg: 'Bu mekana zaten yorum yaptınız' });
    }

    // Yeni yorumu oluştur
    const newComment = new Comment({
      user: userId,
      place: placeId,
      rating: Number(rating),
      title: title || '',
      text,
      imageUrl: imageUrl || '',
    });

    await newComment.save();

    // Mekanın rating ve reviewCount değerlerini güncelle
    const comments = await Comment.find({ place: placeId });
    const numReviews = comments.length;
    const avgRating = comments.reduce((acc, item) => item.rating + acc, 0) / numReviews;

    place.routeMindReviewCount = numReviews;
    place.routeMindRating = avgRating;
    await place.save();

    // Yorumu popüle edip geri dön (frontend'de göstermek için isim lazım)
    const populatedComment = await Comment.findById(newComment._id).populate('user', 'name');

    res.status(201).json(populatedComment);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Mekan bulunamadı' });
    }
    res.status(500).send('Sunucu hatası');
  }
};

// @desc    Mekanın tüm yorumlarını getir
// @route   GET /api/comments/place/:placeId
// @access  Public
const getPlaceComments = async (req, res) => {
  try {
    const placeId = req.params.placeId;
    const comments = await Comment.find({ place: placeId })
      .populate('user', 'name')
      .sort({ createdAt: -1 }); // En yeni yorumlar önce

    res.json(comments);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Mekan bulunamadı' });
    }
    res.status(500).send('Sunucu hatası');
  }
};

module.exports = {
  addComment,
  getPlaceComments,
};
