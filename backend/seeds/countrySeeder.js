require('dotenv').config();
const mongoose = require('mongoose');
const Country = require('../models/Country');

const MONGO_URI = process.env.MONGO_URI;

const newCountries = [
  {
    name: 'İtalya',
    code: 'IT',
    flag: '🇮🇹',
    continent: 'Avrupa',
    capital: 'Roma',
    population: 58850717,
  },
  {
    name: 'Japonya',
    code: 'JP',
    flag: '🇯🇵',
    continent: 'Asya',
    capital: 'Tokyo',
    population: 125700000,
  },
  {
    name: 'Fransa',
    code: 'FR',
    flag: '🇫🇷',
    continent: 'Avrupa',
    capital: 'Paris',
    population: 67390000,
  },
  {
    name: 'İspanya',
    code: 'ES',
    flag: '🇪🇸',
    continent: 'Avrupa',
    capital: 'Madrid',
    population: 47420000,
  },
  {
    name: 'Brezilya',
    code: 'BR',
    flag: '🇧🇷',
    continent: 'Güney Amerika',
    capital: 'Brasília',
    population: 214300000,
  },
  {
    name: 'Mısır',
    code: 'EG',
    flag: '🇪🇬',
    continent: 'Afrika',
    capital: 'Kahire',
    population: 104000000,
  },
  {
    name: 'Avustralya',
    code: 'AU',
    flag: '🇦🇺',
    continent: 'Okyanusya',
    capital: 'Canberra',
    population: 26000000,
  },
  {
    name: 'Almanya',
    code: 'DE',
    flag: '🇩🇪',
    continent: 'Avrupa',
    capital: 'Berlin',
    population: 83200000,
  },
];

const seedCountries = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB Bağlandı');

    for (const country of newCountries) {
      const exists = await Country.findOne({ code: country.code });
      if (!exists) {
        await Country.create(country);
        console.log(`✅ ${country.flag} ${country.name} eklendi`);
      } else {
        console.log(`⏭️  ${country.flag} ${country.name} zaten mevcut, atlandı`);
      }
    }

    console.log('\nTüm ülkeler başarıyla işlendi!');
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('Seed hatası:', err.message);
    process.exit(1);
  }
};

seedCountries();
