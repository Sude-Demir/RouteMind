const Place = require('../models/Place');
const { validationResult } = require('express-validator');

// @desc    Tüm yerleri getir (arama, filtreleme, sıralama, sayfalama)
// @route   GET /api/places
// @access  Public
const getPlaces = async (req, res) => {
  try {
    const {
      search,       // Yer adına göre arama
      category,     // Kategori filtresi
      city,         // Şehir filtresi (city ID)
      country,      // Ülke filtresi (country ID)
      isFeatured,   // Öne çıkan filtresi
      tag,          // Etiket filtresi
      minRating,    // Minimum puan
      sortBy,       // Sıralama alanı (name, rating, reviewCount, createdAt)
      sortOrder,    // Sıralama yönü (asc, desc)
      page,         // Sayfa numarası
      limit,        // Sayfa başı kayıt
      isActive,     // Aktif/pasif filtresi
    } = req.query;

    // Filtre oluştur
    let filter = {};

    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    if (category) {
      filter.category = category;
    }

    if (city) {
      filter.city = city;
    }

    if (country) {
      filter.country = country;
    }

    if (isFeatured !== undefined) {
      filter.isFeatured = isFeatured === 'true';
    }

    if (tag) {
      filter.tags = { $in: [tag] };
    }

    if (minRating) {
      filter.rating = { $gte: parseFloat(minRating) };
    }

    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    } else {
      filter.isActive = true;
    }

    // Sıralama
    let sort = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    } else {
      sort.rating = -1; // Varsayılan: puana göre azalan
    }

    // Sayfalama
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 20;
    const skip = (pageNum - 1) * limitNum;

    const places = await Place.find(filter)
      .populate('city', 'name code region')
      .populate('country', 'name code flag')
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    const total = await Place.countDocuments(filter);

    res.json({
      places,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalPlaces: total,
        perPage: limitNum,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Sunucu hatası');
  }
};

// @desc    Tek yer getir (slug ile)
// @route   GET /api/places/slug/:slug
// @access  Public
const getPlaceBySlug = async (req, res) => {
  try {
    const place = await Place.findOne({ slug: req.params.slug })
      .populate('city', 'name code region imageUrl')
      .populate('country', 'name code flag imageUrl');

    if (!place) {
      return res.status(404).json({ msg: 'Yer bulunamadı' });
    }

    res.json(place);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Sunucu hatası');
  }
};

// @desc    Tek yer getir (ID ile)
// @route   GET /api/places/:id
// @access  Public
const getPlaceById = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id)
      .populate('city', 'name code region imageUrl')
      .populate('country', 'name code flag imageUrl');

    if (!place) {
      return res.status(404).json({ msg: 'Yer bulunamadı' });
    }

    res.json(place);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Yer bulunamadı' });
    }
    res.status(500).send('Sunucu hatası');
  }
};

// @desc    Şehre göre yerleri getir
// @route   GET /api/places/city/:cityId
// @access  Public
const getPlacesByCity = async (req, res) => {
  try {
    const places = await Place.find({ city: req.params.cityId, isActive: true })
      .populate('city', 'name code region')
      .populate('country', 'name code flag')
      .sort({ rating: -1 });

    res.json(places);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Sunucu hatası');
  }
};

// @desc    Kategoriye göre yerleri getir
// @route   GET /api/places/category/:category
// @access  Public
const getPlacesByCategory = async (req, res) => {
  try {
    const places = await Place.find({ category: req.params.category, isActive: true })
      .populate('city', 'name code region')
      .populate('country', 'name code flag')
      .sort({ rating: -1 });

    res.json(places);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Sunucu hatası');
  }
};

// @desc    Öne çıkan yerleri getir
// @route   GET /api/places/featured
// @access  Public
const getFeaturedPlaces = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;
    const places = await Place.find({ isFeatured: true, isActive: true })
      .populate('city', 'name code region')
      .populate('country', 'name code flag')
      .sort({ rating: -1 })
      .limit(limit);

    res.json(places);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Sunucu hatası');
  }
};

// @desc    Yeni yer ekle
// @route   POST /api/places
// @access  Private (Admin)
const createPlace = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    name, slug, city, country, category, description, shortDescription,
    imageUrl, images, latitude, longitude, address, rating, reviewCount,
    visitDuration, entranceFee, openingHours, tags, isFeatured,
  } = req.body;

  try {
    // Aynı şehirde aynı isim var mı kontrol et
    let existingPlace = await Place.findOne({ name, city });
    if (existingPlace) {
      return res.status(400).json({ errors: [{ msg: 'Bu şehirde aynı isimli bir yer zaten mevcut' }] });
    }

    const place = new Place({
      name, slug, city, country, category, description, shortDescription,
      imageUrl, images, latitude, longitude, address, rating, reviewCount,
      visitDuration, entranceFee, openingHours, tags, isFeatured,
    });

    await place.save();

    res.status(201).json({ msg: 'Yer başarıyla eklendi', place });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Sunucu hatası');
  }
};

// @desc    Yer güncelle
// @route   PUT /api/places/:id
// @access  Private (Admin)
const updatePlace = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    let place = await Place.findById(req.params.id);

    if (!place) {
      return res.status(404).json({ msg: 'Yer bulunamadı' });
    }

    place = await Place.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.json({ msg: 'Yer başarıyla güncellendi', place });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Yer bulunamadı' });
    }
    res.status(500).send('Sunucu hatası');
  }
};

// @desc    Yer sil
// @route   DELETE /api/places/:id
// @access  Private (Admin)
const deletePlace = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);

    if (!place) {
      return res.status(404).json({ msg: 'Yer bulunamadı' });
    }

    await Place.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Yer başarıyla silindi' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Yer bulunamadı' });
    }
    res.status(500).send('Sunucu hatası');
  }
};

// @desc    Tüm benzersiz kategorileri getir
// @route   GET /api/places/meta/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await Place.distinct('category', { isActive: true });
    res.json(categories.sort());
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Sunucu hatası');
  }
};

module.exports = {
  getPlaces,
  getPlaceBySlug,
  getPlaceById,
  getPlacesByCity,
  getPlacesByCategory,
  getFeaturedPlaces,
  createPlace,
  updatePlace,
  deletePlace,
  getCategories,
};
