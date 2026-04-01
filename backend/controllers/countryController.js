const Country = require('../models/Country');

// @desc    Tüm ülkeleri getir
// @route   GET /api/countries
// @access  Public
const getCountries = async (req, res) => {
  try {
    const countries = await Country.find({ isActive: true }).sort({ name: 1 });
    res.json(countries);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Sunucu hatası');
  }
};

// @desc    Tek ülke getir
// @route   GET /api/countries/:id
// @access  Public
const getCountryById = async (req, res) => {
  try {
    const country = await Country.findById(req.params.id);
    if (!country) {
      return res.status(404).json({ msg: 'Ülke bulunamadı' });
    }
    res.json(country);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Sunucu hatası');
  }
};

module.exports = {
  getCountries,
  getCountryById,
};
