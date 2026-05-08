require('dotenv').config();
const mongoose = require('mongoose');
const Place = require('../models/Place');
const City = require('../models/City');
const Country = require('../models/Country');

const MONGO_URI = process.env.MONGO_URI;

const missingTurkeyPlacesData = [
  { cityName: 'Adana', name: 'Taş Köprü', slug: 'tas-kopru-adana', category: 'Tarihi', latitude: 36.9850, longitude: 35.3340 },
  { cityName: 'Afyonkarahisar', name: 'Afyonkarahisar Kalesi', slug: 'afyon-kalesi', category: 'Tarihi', latitude: 38.7564, longitude: 30.5369 },
  { cityName: 'Aksaray', name: 'Ihlara Vadisi', slug: 'ihlara-vadisi', category: 'Doğa', latitude: 38.2435, longitude: 34.3015 },
  { cityName: 'Ardahan', name: 'Şeytan Kalesi', slug: 'seytan-kalesi-ardahan', category: 'Tarihi', latitude: 41.1578, longitude: 43.1415 },
  { cityName: 'Aydın', name: 'Efes Antik Kenti (yakın)', slug: 'efes-aydin', category: 'Tarihi', latitude: 37.9411, longitude: 27.3414 }, // Aydın sınırı
  { cityName: 'Ağrı', name: 'İshak Paşa Sarayı', slug: 'ishak-pasa-sarayi', category: 'Tarihi', latitude: 39.5262, longitude: 44.1287 },
  { cityName: 'Balıkesir', name: 'Kaz Dağları', slug: 'kaz-daglari-balikesir', category: 'Doğa', latitude: 39.7180, longitude: 26.8378 },
  { cityName: 'Bartın', name: 'Amasra Kalesi', slug: 'amasra-kalesi', category: 'Tarihi', latitude: 41.7483, longitude: 32.3853 },
  { cityName: 'Batman', name: 'Hasankeyf', slug: 'hasankeyf-batman', category: 'Tarihi', latitude: 37.7128, longitude: 41.4116 },
  { cityName: 'Bayburt', name: 'Bayburt Kalesi', slug: 'bayburt-kalesi', category: 'Tarihi', latitude: 40.2605, longitude: 40.2289 },
  { cityName: 'Bilecik', name: 'Ertuğrul Gazi Türbesi', slug: 'ertugrul-gazi-turbesi', category: 'Tarihi', latitude: 40.0232, longitude: 30.1775 },
  { cityName: 'Bingöl', name: 'Yüzen Adalar', slug: 'yuzen-adalar-bingol', category: 'Doğa', latitude: 38.8872, longitude: 40.4950 },
  { cityName: 'Bitlis', name: 'Ahlat Selçuklu Mezarlığı', slug: 'ahlat-mezarligi', category: 'Tarihi', latitude: 38.7494, longitude: 42.4700 },
  { cityName: 'Bolu', name: 'Yedigöller Milli Parkı', slug: 'yedigoller-bolu', category: 'Doğa', latitude: 40.9415, longitude: 31.7454 },
  { cityName: 'Burdur', name: 'Salda Gölü', slug: 'salda-golu', category: 'Doğa', latitude: 37.5501, longitude: 29.6805 },
  { cityName: 'Düzce', name: 'Güzeldere Şelalesi', slug: 'guzeldere-selalesi', category: 'Doğa', latitude: 40.7583, longitude: 31.0660 },
  { cityName: 'Elazığ', name: 'Harput Kalesi', slug: 'harput-kalesi', category: 'Tarihi', latitude: 38.7051, longitude: 39.2559 },
  { cityName: 'Erzincan', name: 'Girlevik Şelalesi', slug: 'girlevik-selalesi', category: 'Doğa', latitude: 39.5960, longitude: 39.7330 },
  { cityName: 'Erzurum', name: 'Çifte Minareli Medrese', slug: 'cifte-minareli-erzurum', category: 'Tarihi', latitude: 39.9056, longitude: 41.2778 },
  { cityName: 'Giresun', name: 'Giresun Adası', slug: 'giresun-adasi', category: 'Doğa', latitude: 40.9251, longitude: 38.4357 },
  { cityName: 'Gümüşhane', name: 'Karaca Mağarası', slug: 'karaca-magarasi', category: 'Doğa', latitude: 40.5487, longitude: 39.4217 },
  { cityName: 'Hakkari', name: 'Cilo Dağları', slug: 'cilo-daglari', category: 'Doğa', latitude: 37.5447, longitude: 43.9930 },
  { cityName: 'Hatay', name: 'Hatay Arkeoloji Müzesi', slug: 'hatay-muzesi', category: 'Müze', latitude: 36.2166, longitude: 36.1601 },
  { cityName: 'Isparta', name: 'Eğirdir Gölü', slug: 'egirdir-golu', category: 'Doğa', latitude: 37.8920, longitude: 30.8654 },
  { cityName: 'Iğdır', name: 'Ağrı Dağı (Iğdır yamaçları)', slug: 'agri-dagi-igdir', category: 'Doğa', latitude: 39.7025, longitude: 44.2990 },
  { cityName: 'Kahramanmaraş', name: 'Yedi Güzel Adam Müzesi', slug: 'yedi-guzel-adam', category: 'Müze', latitude: 37.5858, longitude: 36.9371 },
  { cityName: 'Karaman', name: 'Karaman Kalesi', slug: 'karaman-kalesi', category: 'Tarihi', latitude: 37.1818, longitude: 33.2206 },
  { cityName: 'Kastamonu', name: 'Kastamonu Kalesi', slug: 'kastamonu-kalesi', category: 'Tarihi', latitude: 41.3789, longitude: 33.7745 },
  { cityName: 'Kayseri', name: 'Erciyes Dağı', slug: 'erciyes-dagi', category: 'Doğa', latitude: 38.5303, longitude: 35.4468 },
  { cityName: 'Kilis', name: 'Ravanda Kalesi', slug: 'ravanda-kalesi', category: 'Tarihi', latitude: 36.8529, longitude: 36.9743 },
  { cityName: 'Kocaeli', name: 'Ormanya', slug: 'ormanya-kocaeli', category: 'Doğa', latitude: 40.7107, longitude: 30.1332 },
  { cityName: 'Kütahya', name: 'Aizanoi Antik Kenti', slug: 'aizanoi-kutahya', category: 'Tarihi', latitude: 39.2045, longitude: 29.6146 },
  { cityName: 'Kırklareli', name: 'İğneada Longoz Ormanları', slug: 'igneada-longoz', category: 'Doğa', latitude: 41.8767, longitude: 27.9866 },
  { cityName: 'Kırıkkale', name: 'Silah Sanayi Müzesi', slug: 'silah-sanayi-muzesi', category: 'Müze', latitude: 39.8468, longitude: 33.5135 },
  { cityName: 'Kırşehir', name: 'Cacabey Medresesi', slug: 'cacabey-medresesi', category: 'Tarihi', latitude: 39.1444, longitude: 34.1610 },
  { cityName: 'Malatya', name: 'Arslantepe Höyüğü', slug: 'arslantepe-malatya', category: 'Tarihi', latitude: 38.3814, longitude: 38.3611 },
  { cityName: 'Manisa', name: 'Sardes Antik Kenti', slug: 'sardes-manisa', category: 'Tarihi', latitude: 38.4883, longitude: 28.0402 },
  { cityName: 'Mersin', name: 'Cennet Cehennem Mağaraları', slug: 'cennet-cehennem', category: 'Doğa', latitude: 36.4522, longitude: 34.1082 },
  { cityName: 'Muş', name: 'Murat Köprüsü', slug: 'murat-koprusu-mus', category: 'Tarihi', latitude: 38.8315, longitude: 41.4881 },
  { cityName: 'Niğde', name: 'Niğde Kalesi', slug: 'nigde-kalesi', category: 'Tarihi', latitude: 37.9678, longitude: 34.6781 },
  { cityName: 'Ordu', name: 'Boztepe', slug: 'boztepe-ordu', category: 'Doğa', latitude: 40.9859, longitude: 37.8687 },
  { cityName: 'Osmaniye', name: 'Karatepe Aslantaş Açık Hava Müzesi', slug: 'karatepe-aslantas', category: 'Tarihi', latitude: 37.2891, longitude: 36.2570 },
  { cityName: 'Sakarya', name: 'Sapanca Gölü', slug: 'sapanca-golu', category: 'Doğa', latitude: 40.7188, longitude: 30.2644 },
  { cityName: 'Siirt', name: 'Botan Vadisi Milli Parkı', slug: 'botan-vadisi', category: 'Doğa', latitude: 37.9158, longitude: 41.9366 },
  { cityName: 'Sinop', name: 'Tarihi Sinop Cezaevi', slug: 'sinop-cezaevi', category: 'Tarihi', latitude: 42.0252, longitude: 35.1555 },
  { cityName: 'Sivas', name: 'Divriği Ulu Camii ve Darüşşifası', slug: 'divrigi-ulu-camii', category: 'Tarihi', latitude: 39.3735, longitude: 38.1219 },
  { cityName: 'Tekirdağ', name: 'Rakoczi Müzesi', slug: 'rakoczi-muzesi', category: 'Müze', latitude: 40.9760, longitude: 27.5097 },
  { cityName: 'Tokat', name: 'Ballıca Mağarası', slug: 'ballica-magarasi', category: 'Doğa', latitude: 40.2285, longitude: 36.3103 },
  { cityName: 'Tunceli', name: 'Munzur Vadisi Milli Parkı', slug: 'munzur-vadisi', category: 'Doğa', latitude: 39.2981, longitude: 39.5401 },
  { cityName: 'Uşak', name: 'Ulubey Kanyonu', slug: 'ulubey-kanyonu', category: 'Doğa', latitude: 38.4239, longitude: 29.2897 },
  { cityName: 'Yalova', name: 'Yürüyen Köşk', slug: 'yuruyen-kosk', category: 'Tarihi', latitude: 40.6657, longitude: 29.2905 },
  { cityName: 'Yozgat', name: 'Yozgat Çamlığı Milli Parkı', slug: 'yozgat-camligi', category: 'Doğa', latitude: 39.8142, longitude: 34.8080 },
  { cityName: 'Zonguldak', name: 'Gökgöl Mağarası', slug: 'gokgol-magarasi', category: 'Doğa', latitude: 41.4312, longitude: 31.8123 },
  { cityName: 'Çankırı', name: 'Tuz Mağarası', slug: 'tuz-magarasi-cankiri', category: 'Doğa', latitude: 40.6120, longitude: 33.7236 },
  { cityName: 'Çorum', name: 'Hattuşa Antik Kenti', slug: 'hattusa-corum', category: 'Tarihi', latitude: 40.0195, longitude: 34.6155 },
  { cityName: 'Şırnak', name: 'Cudi Dağı', slug: 'cudi-dagi', category: 'Doğa', latitude: 37.3688, longitude: 42.4820 }
];

const seedMissingTurkeyPlaces = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB Bağlandı');

    const turkey = await Country.findOne({ code: 'TR' });
    if (!turkey) {
      console.log('Türkiye veritabanında bulunamadı!');
      process.exit(1);
    }

    const allCities = await City.find({ country: turkey._id });
    const cityMap = {};
    allCities.forEach(city => {
      cityMap[city.name] = city._id;
    });

    let addedCount = 0;

    for (const placeData of missingTurkeyPlacesData) {
      const cityId = cityMap[placeData.cityName];
      if (!cityId) {
        console.log(`⚠️  Şehir bulunamadı: ${placeData.cityName}`);
        continue;
      }

      const existing = await Place.findOne({ slug: placeData.slug });
      if (existing) {
        console.log(`⏭️  Zaten mevcut: ${placeData.name}`);
        continue;
      }

      const { cityName, ...placeFields } = placeData;
      await Place.create({
        ...placeFields,
        city: cityId,
        country: turkey._id,
        shortDescription: `${placeData.name}, ${cityName} şehrinin en önemli noktalarından biridir.`,
        description: `${placeData.name}, tarihi ve doğal güzelliği ile öne çıkan, mutlaka ziyaret edilmesi gereken eşsiz bir yerdir.`,
        imageUrl: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&h=500&fit=crop',
        rating: 4.5,
        reviewCount: Math.floor(Math.random() * 5000) + 100,
        visitDuration: '1-2 saat',
        entranceFee: 'Ücretsiz',
        openingHours: '24 saat',
        tags: [cityName.toLowerCase(), 'gezi'],
        isFeatured: false
      });
      
      console.log(`✅ [TR] ${placeData.cityName} - ${placeData.name}`);
      addedCount++;
    }

    console.log(`\n🎉 ${addedCount} Türkiye yeri başarıyla eklendi!`);
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('Seed hatası:', err.message);
    process.exit(1);
  }
};

seedMissingTurkeyPlaces();
