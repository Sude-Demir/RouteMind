require('dotenv').config();
const mongoose = require('mongoose');
const Place = require('../models/Place');
const City = require('../models/City');
const Country = require('../models/Country');

const MONGO_URI = process.env.MONGO_URI;

const missingPlacesData = [
  // ALMANYA
  { countryCode: 'DE', cityName: 'Düsseldorf', name: 'Rheinturm', slug: 'rheinturm-dusseldorf', category: 'Tarihi', shortDescription: 'Şehrin en yüksek kulesi.', latitude: 51.2179, longitude: 6.7616 },
  { countryCode: 'DE', cityName: 'Frankfurt', name: 'Römerberg', slug: 'romerberg-frankfurt', category: 'Tarihi', shortDescription: 'Frankfurt\'un tarihi merkez meydanı.', latitude: 50.1105, longitude: 8.6821 },
  { countryCode: 'DE', cityName: 'Hamburg', name: 'Miniatur Wunderland', slug: 'miniatur-wunderland', category: 'Eğlence', shortDescription: 'Dünyanın en büyük minyatür demiryolu.', latitude: 53.5438, longitude: 9.9882 },
  { countryCode: 'DE', cityName: 'Nürnberg', name: 'Nürnberg Kalesi', slug: 'nurnberg-kalesi', category: 'Tarihi', shortDescription: 'Şehrin sembolü olan Orta Çağ kalesi.', latitude: 49.4578, longitude: 11.0759 },
  { countryCode: 'DE', cityName: 'Stuttgart', name: 'Mercedes-Benz Müzesi', slug: 'mercedes-muzesi', category: 'Müze', shortDescription: 'Otomobil tarihinin kalbi.', latitude: 48.7876, longitude: 9.2333 },

  // ABD
  { countryCode: 'US', cityName: 'Los Angeles', name: 'Hollywood Walk of Fame', slug: 'hollywood-walk', category: 'Kültür', shortDescription: 'Yıldızların isimlerinin bulunduğu ünlü kaldırım.', latitude: 34.1016, longitude: -118.3268 },
  { countryCode: 'US', cityName: 'Miami', name: 'South Beach', slug: 'south-beach-miami', category: 'Plaj', shortDescription: 'Art Deco mimarisi ve muhteşem sahili.', latitude: 25.7826, longitude: -80.1340 },

  // AVUSTRALYA
  { countryCode: 'AU', cityName: 'Adelaide', name: 'Adelaide Botanik Bahçesi', slug: 'adelaide-botanik', category: 'Doğa', shortDescription: 'Şehrin kalbinde yeşil bir vaha.', latitude: -34.9180, longitude: 138.6105 },
  { countryCode: 'AU', cityName: 'Brisbane', name: 'South Bank Parklands', slug: 'south-bank-brisbane', category: 'Park', shortDescription: 'Brisbane nehri kıyısında popüler park.', latitude: -27.4795, longitude: 153.0210 },
  { countryCode: 'AU', cityName: 'Canberra', name: 'Avustralya Parlamento Binası', slug: 'avustralya-parlamento', category: 'Tarihi', shortDescription: 'Modern mimarisiyle ülkenin yönetim merkezi.', latitude: -35.3082, longitude: 149.1244 },
  { countryCode: 'AU', cityName: 'Gold Coast', name: 'Surfers Paradise Plajı', slug: 'surfers-paradise', category: 'Plaj', shortDescription: 'Sörfçülerin ve turistlerin gözdesi.', latitude: -28.0028, longitude: 153.4295 },
  { countryCode: 'AU', cityName: 'Hobart', name: 'MONA', slug: 'mona-hobart', category: 'Müze', shortDescription: 'Eski ve Yeni Sanat Müzesi.', latitude: -42.8126, longitude: 147.2605 },

  // BREZİLYA
  { countryCode: 'BR', cityName: 'Belo Horizonte', name: 'Praça da Liberdade', slug: 'praca-da-liberdade', category: 'Kültür', shortDescription: 'Şehrin tarihi ve kültürel merkezi.', latitude: -19.9320, longitude: -43.9379 },
  { countryCode: 'BR', cityName: 'Curitiba', name: 'Jardim Botânico', slug: 'jardim-botanico-curitiba', category: 'Doğa', shortDescription: 'Cam serasıyla ünlü muhteşem botanik bahçe.', latitude: -25.4429, longitude: -49.2382 },
  { countryCode: 'BR', cityName: 'Fortaleza', name: 'Praia do Futuro', slug: 'praia-do-futuro', category: 'Plaj', shortDescription: 'Canlı plaj kulüpleriyle bilinen sahil.', latitude: -3.7380, longitude: -38.4550 },
  { countryCode: 'BR', cityName: 'Porto Alegre', name: 'Mercado Público', slug: 'mercado-publico-poa', category: 'Kültür', shortDescription: 'Tarihi halk pazarı ve gastronomi merkezi.', latitude: -30.0277, longitude: -51.2287 },
  { countryCode: 'BR', cityName: 'Recife', name: 'Praça do Marco Zero', slug: 'marco-zero-recife', category: 'Tarihi', shortDescription: 'Recife\'nin tarihi sıfır noktası.', latitude: -8.0628, longitude: -34.8711 },
  { countryCode: 'BR', cityName: 'São Paulo', name: 'Ibirapuera Parkı', slug: 'ibirapuera-parki', category: 'Park', shortDescription: 'São Paulo\'nun en büyük ve en ünlü parkı.', latitude: -23.5874, longitude: -46.6576 },

  // FRANSA
  { countryCode: 'FR', cityName: 'Lille', name: 'Grand Place', slug: 'grand-place-lille', category: 'Tarihi', shortDescription: 'Lille\'in görkemli ana meydanı.', latitude: 50.6366, longitude: 3.0635 },
  { countryCode: 'FR', cityName: 'Lyon', name: 'Basilica of Notre-Dame de Fourvière', slug: 'notre-dame-fourviere', category: 'Tarihi', shortDescription: 'Lyon manzarasına hakim bazilika.', latitude: 45.7623, longitude: 4.8226 },
  { countryCode: 'FR', cityName: 'Marsilya', name: 'Vieux Port (Eski Liman)', slug: 'vieux-port-marsilya', category: 'Kültür', shortDescription: 'Marsilya\'nın 2600 yıllık tarihi limanı.', latitude: 43.2951, longitude: 5.3740 },
  { countryCode: 'FR', cityName: 'Montpellier', name: 'Place de la Comédie', slug: 'place-de-la-comedie', category: 'Tarihi', shortDescription: 'Şehrin hareketli ve zarif meydanı.', latitude: 43.6084, longitude: 3.8795 },
  { countryCode: 'FR', cityName: 'Nantes', name: 'Château des ducs de Bretagne', slug: 'chateau-bretagne', category: 'Tarihi', shortDescription: 'Bretanya Dükleri Şatosu.', latitude: 47.2162, longitude: -1.5498 },
  { countryCode: 'FR', cityName: 'Strasbourg', name: 'Strasbourg Katedrali', slug: 'strasbourg-katedrali', category: 'Tarihi', shortDescription: 'Gotik mimarinin etkileyici örneği.', latitude: 48.5815, longitude: 7.7505 },
  { countryCode: 'FR', cityName: 'Toulouse', name: 'Capitole de Toulouse', slug: 'capitole-toulouse', category: 'Tarihi', shortDescription: 'Toulouse belediye binası ve meydanı.', latitude: 43.6044, longitude: 1.4442 },

  // HİNDİSTAN
  { countryCode: 'IN', cityName: 'Mumbai', name: 'Gateway of India', slug: 'gateway-of-india', category: 'Tarihi', shortDescription: 'Mumbai\'nin ikonik kemeri ve liman girişi.', latitude: 18.9220, longitude: 72.8347 },

  // HOLLANDA
  { countryCode: 'NL', cityName: 'Lahey', name: 'Mauritshuis Müzesi', slug: 'mauritshuis-muzesi', category: 'Müze', shortDescription: 'İnci Küpeli Kız tablosuna ev sahipliği yapar.', latitude: 52.0804, longitude: 4.3143 },

  // JAPONYA
  { countryCode: 'JP', cityName: 'Fukuoka', name: 'Ohori Parkı', slug: 'ohori-parki', category: 'Park', shortDescription: 'Geniş bir göle sahip güzel bir şehir parkı.', latitude: 33.5859, longitude: 130.3763 },
  { countryCode: 'JP', cityName: 'Kobe', name: 'Kobe Liman Kulesi', slug: 'kobe-liman-kulesi', category: 'Tarihi', shortDescription: 'Kobe limanının simgesi olan kırmızı kule.', latitude: 34.6826, longitude: 135.1867 },
  { countryCode: 'JP', cityName: 'Nagoya', name: 'Nagoya Kalesi', slug: 'nagoya-kalesi', category: 'Tarihi', shortDescription: 'Altın kaplan balığı heykelleriyle ünlü kale.', latitude: 35.1856, longitude: 136.8991 },
  { countryCode: 'JP', cityName: 'Sapporo', name: 'Odori Parkı', slug: 'odori-parki', category: 'Park', shortDescription: 'Kış festivalinin yapıldığı uzun park.', latitude: 43.0601, longitude: 141.3475 },
  { countryCode: 'JP', cityName: 'Yokohama', name: 'Minato Mirai 21', slug: 'minato-mirai', category: 'Eğlence', shortDescription: 'Yokohama\'nın fütüristik sahil bölgesi.', latitude: 35.4566, longitude: 139.6322 },

  // MEKSİKA
  { countryCode: 'MX', cityName: 'Mérida', name: 'Plaza Grande', slug: 'plaza-grande-merida', category: 'Tarihi', shortDescription: 'Mérida\'nın tarihi merkezi meydanı.', latitude: 20.9671, longitude: -89.6237 },

  // MISIR
  { countryCode: 'EG', cityName: 'Fayyum', name: 'Wadi El Rayan', slug: 'wadi-el-rayan', category: 'Doğa', shortDescription: 'Çöl ortasında göller ve şelaleler bölgesi.', latitude: 29.1417, longitude: 30.4079 },
  { countryCode: 'EG', cityName: 'Hurghada', name: 'Giftun Adası', slug: 'giftun-adasi', category: 'Plaj', shortDescription: 'Kızıldeniz\'in mercan resifleri ve plaj cenneti.', latitude: 27.1856, longitude: 33.9575 },
  { countryCode: 'EG', cityName: 'Port Said', name: 'Süveyş Kanalı Kurumu Binası', slug: 'suveys-kurumu', category: 'Tarihi', shortDescription: 'Kanalın tarihi yönetim binası.', latitude: 31.2618, longitude: 32.3082 },
  { countryCode: 'EG', cityName: 'Süveyş', name: 'Süveyş Kanalı', slug: 'suveys-kanali', category: 'Tarihi', shortDescription: 'Kızıldeniz ile Akdeniz\'i bağlayan kanal.', latitude: 29.9329, longitude: 32.5599 },
  { countryCode: 'EG', cityName: 'İskenderiye', name: 'İskenderiye Kütüphanesi', slug: 'iskenderiye-kutuphanesi', category: 'Kültür', shortDescription: 'Modern mimarili devasa kütüphane kompleksi.', latitude: 31.2089, longitude: 29.9092 },

  // PERU
  { countryCode: 'PE', cityName: 'Lima', name: 'Plaza Mayor', slug: 'plaza-mayor-lima', category: 'Tarihi', shortDescription: 'Lima\'nın tarihi merkez meydanı.', latitude: -12.0453, longitude: -77.0311 },

  // YUNANİSTAN
  { countryCode: 'GR', cityName: 'Selanik', name: 'Beyaz Kule', slug: 'beyaz-kule-selanik', category: 'Tarihi', shortDescription: 'Selanik sahili üzerindeki tarihi simge.', latitude: 40.6264, longitude: 22.9484 },

  // ÇİN
  { countryCode: 'CN', cityName: 'Şanghay', name: 'The Bund', slug: 'the-bund-sanghay', category: 'Tarihi', shortDescription: 'Tarihi binalar ve karşı kıyı gökdelenleri manzarası.', latitude: 31.2384, longitude: 121.4883 },

  // İNGİLTERE
  { countryCode: 'GB', cityName: 'Manchester', name: 'John Rylands Kütüphanesi', slug: 'john-rylands-kutuphanesi', category: 'Kültür', shortDescription: 'Neo-Gotik mimarisiyle büyüleyici kütüphane.', latitude: 53.4800, longitude: -2.2492 },

  // İSPANYA
  { countryCode: 'ES', cityName: 'Bilbao', name: 'Guggenheim Müzesi', slug: 'guggenheim-bilbao', category: 'Müze', shortDescription: 'Frank Gehry tasarımı çağdaş sanat müzesi.', latitude: 43.2687, longitude: -2.9340 },
  { countryCode: 'ES', cityName: 'Malaga', name: 'Alcazaba', slug: 'alcazaba-malaga', category: 'Tarihi', shortDescription: 'Endülüs dönemine ait Mağribi kalesi.', latitude: 36.7214, longitude: -4.4150 },
  { countryCode: 'ES', cityName: 'San Sebastián', name: 'La Concha Plajı', slug: 'la-concha', category: 'Plaj', shortDescription: 'İspanya\'nın en ünlü şehir plajı.', latitude: 43.3182, longitude: -1.9863 },
  { countryCode: 'ES', cityName: 'Toledo', name: 'Alcázar of Toledo', slug: 'alcazar-toledo', category: 'Tarihi', shortDescription: 'Tepede konumlanan etkileyici kale.', latitude: 39.8581, longitude: -4.0205 },
  { countryCode: 'ES', cityName: 'Valencia', name: 'Sanat ve Bilim Şehri', slug: 'sanat-bilim-sehri', category: 'Müze', shortDescription: 'Santiago Calatrava\'nın fütüristik kompleksi.', latitude: 39.4542, longitude: -0.3503 },
  { countryCode: 'ES', cityName: 'Zaragoza', name: 'Basilica of Our Lady of the Pillar', slug: 'basilica-pillar', category: 'Tarihi', shortDescription: 'Ebro nehri kıyısındaki devasa barok bazilika.', latitude: 41.6568, longitude: -0.8784 },

  // İTALYA
  { countryCode: 'IT', cityName: 'Bologna', name: 'Piazza Maggiore', slug: 'piazza-maggiore-bologna', category: 'Tarihi', shortDescription: 'Bologna\'nın kalbindeki devasa meydan.', latitude: 44.4938, longitude: 11.3430 },
  { countryCode: 'IT', cityName: 'Cenova', name: 'Cenova Akvaryumu', slug: 'cenova-akvaryumu', category: 'Eğlence', shortDescription: 'Avrupa\'nın en büyük akvaryumlarından biri.', latitude: 44.4103, longitude: 8.9268 },
  { countryCode: 'IT', cityName: 'Palermo', name: 'Palermo Katedrali', slug: 'palermo-katedrali', category: 'Tarihi', shortDescription: 'Arap-Norman mimarisinin görkemli örneği.', latitude: 38.1145, longitude: 13.3561 },
  { countryCode: 'IT', cityName: 'Torino', name: 'Mole Antonelliana', slug: 'mole-antonelliana', category: 'Tarihi', shortDescription: 'Torino\'nun simgesi ve sinema müzesi.', latitude: 45.0689, longitude: 7.6932 },
  { countryCode: 'IT', cityName: 'Verona', name: 'Verona Arenası', slug: 'verona-arenasi', category: 'Tarihi', shortDescription: 'Roma döneminden kalma, opera etkinlikleri yapılan amfitiyatro.', latitude: 45.4390, longitude: 10.9943 }
];

const seedMissingPlaces = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB Bağlandı');

    const countries = await Country.find();
    const countryMap = {};
    countries.forEach(c => { countryMap[c.code] = c._id; });

    const allCities = await City.find();
    const cityMap = {};
    allCities.forEach(city => {
      const key = `${city.country.toString()}__${city.name}`;
      cityMap[key] = city._id;
    });

    let addedCount = 0;

    for (const placeData of missingPlacesData) {
      const countryId = countryMap[placeData.countryCode];
      if (!countryId) continue;

      const key = `${countryId.toString()}__${placeData.cityName}`;
      const cityId = cityMap[key];
      if (!cityId) continue;

      const existing = await Place.findOne({ slug: placeData.slug });
      if (existing) continue;

      const { countryCode, cityName, ...placeFields } = placeData;
      await Place.create({
        ...placeFields,
        city: cityId,
        country: countryId,
        description: placeData.shortDescription,
        imageUrl: 'https://images.unsplash.com/photo-1520175480921-4edfa2983e0f?w=800&h=500&fit=crop'
      });
      
      console.log(`✅ [${placeData.countryCode}] ${placeData.cityName} - ${placeData.name}`);
      addedCount++;
    }

    console.log(`\n🎉 ${addedCount} yabancı yer başarıyla eklendi!`);
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('Seed hatası:', err.message);
    process.exit(1);
  }
};

seedMissingPlaces();
