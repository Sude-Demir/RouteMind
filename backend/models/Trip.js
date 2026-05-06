const mongoose = require('mongoose');

const TripSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Gezi başlığı zorunludur'],
    trim: true,
    maxlength: 100,
  },
  destination: {
    type: String,
    required: [true, 'Varış noktası zorunludur'],
  },
  description: {
    type: String,
    required: [true, 'Açıklama zorunludur'],
    maxlength: 1000,
  },
  startDate: {
    type: Date,
    required: [true, 'Başlangıç tarihi zorunludur'],
  },
  endDate: {
    type: Date,
    required: [true, 'Bitiş tarihi zorunludur'],
  },
  imageUrl: {
    type: String,
    default: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&fit=crop',
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  maxParticipants: {
    type: Number,
    required: [true, 'Maksimum katılımcı sayısı zorunludur'],
    min: [2, 'En az 2 katılımcı olmalıdır'],
    max: [50, 'En fazla 50 katılımcı olabilir'],
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed'],
    default: 'upcoming',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Trip', TripSchema);
