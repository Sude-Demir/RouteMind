const Trip = require('../models/Trip');
const { validationResult } = require('express-validator');

// @desc    Tüm gezileri getir
// @route   GET /api/trips
// @access  Public
const getTrips = async (req, res) => {
  try {
    const trips = await Trip.find()
      .populate('creator', 'name email')
      .populate('participants', 'name')
      .sort({ createdAt: -1 });
    res.json(trips);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Sunucu hatası');
  }
};

// @desc    Giriş yapan kullanıcının katıldığı gezileri getir
// @route   GET /api/trips/my
// @access  Private
const getMyTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ participants: req.user.id })
      .populate('creator', 'name email')
      .populate('participants', 'name')
      .sort({ startDate: 1 });
    res.json(trips);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Sunucu hatası');
  }
};

// @desc    Yeni gezi oluştur
// @route   POST /api/trips
// @access  Private
const createTrip = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, destination, description, startDate, endDate, maxParticipants, imageUrl } = req.body;

    const newTrip = new Trip({
      title,
      destination,
      description,
      startDate,
      endDate,
      maxParticipants,
      imageUrl,
      creator: req.user.id,
      participants: [req.user.id], // Oluşturan kişi otomatik katılır
    });

    const trip = await newTrip.save();
    
    // Geri dönerken populate edelim ki anında ekranda görebilelim
    const populatedTrip = await Trip.findById(trip._id)
      .populate('creator', 'name')
      .populate('participants', 'name');

    res.status(201).json(populatedTrip);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Sunucu hatası');
  }
};

// @desc    Geziye katıl
// @route   PUT /api/trips/:id/join
// @access  Private
const joinTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ msg: 'Gezi bulunamadı' });
    }

    // Katılımcı sayısını kontrol et
    if (trip.participants.length >= trip.maxParticipants) {
      return res.status(400).json({ msg: 'Bu gezi grubu tamamen dolu' });
    }

    // Zaten katılmış mı kontrol et
    if (trip.participants.includes(req.user.id)) {
      return res.status(400).json({ msg: 'Bu geziye zaten katıldınız' });
    }

    trip.participants.push(req.user.id);
    await trip.save();

    const updatedTrip = await Trip.findById(req.params.id)
      .populate('creator', 'name')
      .populate('participants', 'name');

    res.json(updatedTrip);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Gezi bulunamadı' });
    }
    res.status(500).send('Sunucu hatası');
  }
};

// @desc    Geziden ayrıl
// @route   PUT /api/trips/:id/leave
// @access  Private
const leaveTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ msg: 'Gezi bulunamadı' });
    }

    // Katılmış mı kontrol et
    if (!trip.participants.includes(req.user.id)) {
      return res.status(400).json({ msg: 'Bu geziye henüz katılmadınız' });
    }

    // Oluşturan kişi ayrılamaz (veya silinir, basitleştirmek için ayrılmasını engelliyoruz)
    if (trip.creator.toString() === req.user.id) {
      return res.status(400).json({ msg: 'Geziyi oluşturan kişi gruptan ayrılamaz. Geziyi iptal etmelisiniz.' });
    }

    trip.participants = trip.participants.filter(
      (participant) => participant.toString() !== req.user.id
    );

    await trip.save();

    const updatedTrip = await Trip.findById(req.params.id)
      .populate('creator', 'name')
      .populate('participants', 'name');

    res.json(updatedTrip);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Gezi bulunamadı' });
    }
    res.status(500).send('Sunucu hatası');
  }
};

// @desc    Geziyi sil
// @route   DELETE /api/trips/:id
// @access  Private
const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ msg: 'Gezi bulunamadı' });
    }

    // Sadece oluşturan kişi silebilir
    if (trip.creator.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Yetkisiz işlem' });
    }

    await trip.deleteOne();

    res.json({ msg: 'Gezi silindi' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Gezi bulunamadı' });
    }
    res.status(500).send('Sunucu hatası');
  }
};

module.exports = {
  getTrips,
  getMyTrips,
  createTrip,
  joinTrip,
  leaveTrip,
  deleteTrip
};
