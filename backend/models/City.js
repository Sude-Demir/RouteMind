const mongoose = require('mongoose');

const CitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Şehir adı zorunludur'],
    trim: true,
  },
  code: {
    type: Number,
    required: [true, 'Şehir kodu zorunludur'],
  },
  region: {
    type: String,
    required: [true, 'Bölge bilgisi zorunludur'],
  },
  country: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Country',
    required: [true, 'Ülke bilgisi zorunludur'],
  },
  population: {
    type: Number,
    default: 0,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  imageUrl: {
    type: String,
    default: '',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  attractions: [{
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound unique index: same country can't have duplicate city names or codes
CitySchema.index({ name: 1, country: 1 }, { unique: true });
CitySchema.index({ code: 1, country: 1 }, { unique: true });

module.exports = mongoose.model('City', CitySchema);
