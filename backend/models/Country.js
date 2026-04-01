const mongoose = require('mongoose');

const CountrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Ülke adı zorunludur'],
    unique: true,
    trim: true,
  },
  code: {
    type: String,
    required: [true, 'Ülke kodu zorunludur'],
    unique: true,
    uppercase: true,
  },
  flag: {
    type: String,
    default: '',
  },
  imageUrl: {
    type: String,
    default: '',
  },
  continent: {
    type: String,
    enum: ['Avrupa', 'Asya', 'Afrika', 'Kuzey Amerika', 'Güney Amerika', 'Okyanusya', 'Antarktika'],
  },
  capital: {
    type: String,
    default: '',
  },
  population: {
    type: Number,
    default: 0,
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

module.exports = mongoose.model('Country', CountrySchema);
