const mongoose = require('mongoose');

const PlaceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Yer adı zorunludur'],
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City',
    required: [true, 'Şehir bilgisi zorunludur'],
  },
  country: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Country',
    required: [true, 'Ülke bilgisi zorunludur'],
  },
  category: {
    type: String,
    required: [true, 'Kategori zorunludur'],
    enum: [
      'Tarihi',
      'Doğa',
      'Müze',
      'Plaj',
      'Cami',
      'Kilise',
      'Park',
      'Alışveriş',
      'Yeme-İçme',
      'Eğlence',
      'Spor',
      'Kültür',
      'Diğer',
    ],
  },
  description: {
    type: String,
    default: '',
  },
  shortDescription: {
    type: String,
    default: '',
    maxlength: 200,
  },
  imageUrl: {
    type: String,
    default: '',
  },
  images: [{
    type: String,
  }],
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    default: '',
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  reviewCount: {
    type: Number,
    default: 0,
  },
  routeMindRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  routeMindReviewCount: {
    type: Number,
    default: 0,
  },
  externalComments: [{
    authorName: String,
    rating: Number,
    text: String,
    date: String,
    source: { type: String, default: 'Google Haritalar' }
  }],
  visitDuration: {
    type: String,
    default: '',
  },
  entranceFee: {
    type: String,
    default: 'Ücretsiz',
  },
  openingHours: {
    type: String,
    default: '',
  },
  tags: [{
    type: String,
  }],
  isFeatured: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound unique index: same city can't have duplicate place names
PlaceSchema.index({ name: 1, city: 1 }, { unique: true });
// Text index for search
PlaceSchema.index({ name: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Place', PlaceSchema);
