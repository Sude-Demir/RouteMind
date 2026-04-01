require('dotenv').config();
const mongoose = require('mongoose');
const City = require('../models/City');

const MONGO_URI = process.env.MONGO_URI;

// Şehir adı -> local imageUrl eşleşmesi
const cityImages = {
  'İstanbul': '/images/cities/istanbul.png',
  'Ankara': '/images/cities/ankara.png',
  'Antalya': '/images/cities/antalya.png',
  'Bursa': '/images/cities/bursa.png',
  'İzmir': '/images/cities/izmir.png',
  'Nevşehir': '/images/cities/nevsehir.png',
  'Roma': '/images/cities/roma.png',
  'Venedik': '/images/cities/venedik.png',
};

const updateImages = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB Bağlandı');

    for (const [name, imageUrl] of Object.entries(cityImages)) {
      const result = await City.updateMany({ name }, { $set: { imageUrl } });
      if (result.modifiedCount > 0) {
        console.log(`✅ ${name} -> ${imageUrl}`);
      } else {
        console.log(`⏭️  ${name} bulunamadı`);
      }
    }

    console.log('\nGüncelleme tamamlandı!');
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('Hata:', err.message);
    process.exit(1);
  }
};

updateImages();
