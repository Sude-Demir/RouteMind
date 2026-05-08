require('dotenv').config();
const mongoose = require('mongoose');
const Country = require('../models/Country');
const City = require('../models/City');
const Place = require('../models/Place');

const MONGO_URI = process.env.MONGO_URI;

const check = async () => {
  await mongoose.connect(MONGO_URI);
  console.log('MongoDB Bağlandı\n');

  const countries = await Country.find().sort('name');
  
  for (const country of countries) {
    const cities = await City.find({ country: country._id }).sort('name');
    console.log(`\n${country.flag} ${country.name} (${country.code}) — ${cities.length} şehir`);
    
    for (const city of cities) {
      const placeCount = await Place.countDocuments({ city: city._id });
      const status = placeCount === 0 ? '❌ MEKAN YOK' : `✅ ${placeCount} mekan`;
      console.log(`   ${city.name} — ${status}`);
    }
  }

  await mongoose.connection.close();
  process.exit(0);
};

check();
