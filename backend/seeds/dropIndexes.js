require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI;

const dropIndexes = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB Bağlandı');

    const db = mongoose.connection.db;

    // Drop all indexes on cities collection (except _id)
    try {
      await db.collection('cities').dropIndexes();
      console.log('Cities koleksiyonu indexleri silindi');
    } catch (err) {
      console.log('Cities indexleri silinemedi (koleksiyon olmayabilir):', err.message);
    }

    // Drop all documents
    try {
      await db.collection('cities').deleteMany({});
      console.log('Cities koleksiyonu temizlendi');
    } catch (err) {
      console.log('Cities temizlenemedi:', err.message);
    }

    try {
      await db.collection('countries').deleteMany({});
      console.log('Countries koleksiyonu temizlendi');
    } catch (err) {
      console.log('Countries temizlenemedi:', err.message);
    }

    console.log('İndexler ve veriler başarıyla temizlendi!');
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('Hata:', err.message);
    process.exit(1);
  }
};

dropIndexes();
