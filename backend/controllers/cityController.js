const City = require('../models/City');
const { validationResult } = require('express-validator');

// @desc    Tüm şehirleri getir (arama, filtreleme, sıralama, sayfalama)
// @route   GET /api/cities
// @access  Public
const getCities = async (req, res) => {
  try {
    const {
      search,      // Şehir adına göre arama
      region,      // Bölge filtresi
      country,     // Ülke filtresi (country ID)
      sortBy,      // Sıralama alanı (name, code, population)
      sortOrder,   // Sıralama yönü (asc, desc)
      page,        // Sayfa numarası
      limit,       // Sayfa başı kayıt
      isActive,    // Aktif/pasif filtresi
    } = req.query;

    // Filtre oluştur
    let filter = {};

    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    if (region) {
      filter.region = region;
    }

    if (country) {
      filter.country = country;
    }

    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    // Sıralama
    let sort = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    } else {
      sort.code = 1; // Varsayılan: plaka koduna göre artan
    }

    // Sayfalama
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 81; // Varsayılan: tüm şehirler
    const skip = (pageNum - 1) * limitNum;

    const cities = await City.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    const total = await City.countDocuments(filter);

    res.json({
      cities,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalCities: total,
        perPage: limitNum,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Sunucu hatası');
  }
};

// @desc    Tek şehir getir
// @route   GET /api/cities/:id
// @access  Public
const getCityById = async (req, res) => {
  try {
    const city = await City.findById(req.params.id);

    if (!city) {
      return res.status(404).json({ msg: 'Şehir bulunamadı' });
    }

    res.json(city);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Şehir bulunamadı' });
    }
    res.status(500).send('Sunucu hatası');
  }
};

// @desc    Bölgeye göre şehirleri getir
// @route   GET /api/cities/region/:region
// @access  Public
const getCitiesByRegion = async (req, res) => {
  try {
    const cities = await City.find({ region: req.params.region, isActive: true })
      .sort({ code: 1 });

    res.json(cities);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Sunucu hatası');
  }
};

// @desc    Yeni şehir ekle
// @route   POST /api/cities
// @access  Private (Admin)
const createCity = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, code, region, population, latitude, longitude, description, imageUrl, attractions } = req.body;

  try {
    // Aynı isim veya plaka kodu var mı kontrol et
    let existingCity = await City.findOne({ $or: [{ name }, { code }] });
    if (existingCity) {
      return res.status(400).json({ errors: [{ msg: 'Bu şehir adı veya plaka kodu zaten mevcut' }] });
    }

    const city = new City({
      name,
      code,
      region,
      population,
      latitude,
      longitude,
      description,
      imageUrl,
      attractions,
    });

    await city.save();

    res.status(201).json({ msg: 'Şehir başarıyla eklendi', city });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Sunucu hatası');
  }
};

// @desc    Şehir güncelle
// @route   PUT /api/cities/:id
// @access  Private (Admin)
const updateCity = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    let city = await City.findById(req.params.id);

    if (!city) {
      return res.status(404).json({ msg: 'Şehir bulunamadı' });
    }

    city = await City.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.json({ msg: 'Şehir başarıyla güncellendi', city });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Şehir bulunamadı' });
    }
    res.status(500).send('Sunucu hatası');
  }
};

// @desc    Şehir sil
// @route   DELETE /api/cities/:id
// @access  Private (Admin)
const deleteCity = async (req, res) => {
  try {
    const city = await City.findById(req.params.id);

    if (!city) {
      return res.status(404).json({ msg: 'Şehir bulunamadı' });
    }

    await City.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Şehir başarıyla silindi' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Şehir bulunamadı' });
    }
    res.status(500).send('Sunucu hatası');
  }
};

module.exports = {
  getCities,
  getCityById,
  getCitiesByRegion,
  createCity,
  updateCity,
  deleteCity,
};
