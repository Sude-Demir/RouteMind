const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  place: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Place',
    required: true,
  },
  rating: {
    type: Number,
    required: [true, 'Puan vermek zorunludur'],
    min: 1,
    max: 5,
  },
  title: {
    type: String,
    trim: true,
    maxlength: 100,
  },
  text: {
    type: String,
    required: [true, 'Yorum metni zorunludur'],
    trim: true,
    maxlength: 1000,
  },
  imageUrl: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Bir kullanıcı aynı mekana sadece bir yorum yapabilir (Opsiyonel, ama genelde istenir)
CommentSchema.index({ user: 1, place: 1 }, { unique: true });

module.exports = mongoose.model('Comment', CommentSchema);
