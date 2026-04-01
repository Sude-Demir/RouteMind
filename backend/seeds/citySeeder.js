require('dotenv').config();
const mongoose = require('mongoose');
const City = require('../models/City');
const Country = require('../models/Country');

const MONGO_URI = process.env.MONGO_URI;

// Ülke verisi
const countryData = {
  name: 'Türkiye',
  code: 'TR',
  flag: '🇹🇷',
  continent: 'Avrupa',
  capital: 'Ankara',
  population: 85372377,
};

const cities = [
  { name: 'Adana', code: 1, region: 'Akdeniz', population: 2274106, latitude: 37.0, longitude: 35.3213, description: 'Akdeniz Bölgesi\'nin en büyük şehri, kebabı ve Seyhan Nehri ile ünlü.' },
  { name: 'Adıyaman', code: 2, region: 'Güneydoğu Anadolu', population: 635169, latitude: 37.7648, longitude: 38.2786, description: 'Nemrut Dağı\'nın bulunduğu tarihi şehir.' },
  { name: 'Afyonkarahisar', code: 3, region: 'Ege', population: 747555, latitude: 38.7507, longitude: 30.5567, description: 'Termal kaplıcaları, sucuğu ve kaymağı ile ünlü şehir.' },
  { name: 'Ağrı', code: 4, region: 'Doğu Anadolu', population: 510626, latitude: 39.7191, longitude: 43.0503, description: 'Türkiye\'nin en yüksek dağı Ağrı Dağı\'nın bulunduğu şehir.' },
  { name: 'Amasya', code: 5, region: 'Karadeniz', population: 338267, latitude: 40.6499, longitude: 35.8353, description: 'Yeşilırmak kıyısındaki Osmanlı konakları ile ünlü tarihi şehir.' },
  { name: 'Ankara', code: 6, region: 'İç Anadolu', population: 5747325, latitude: 39.9334, longitude: 32.8597, description: 'Türkiye\'nin başkenti, siyasi ve kültürel merkez.' },
  { name: 'Antalya', code: 7, region: 'Akdeniz', population: 2619832, latitude: 36.8969, longitude: 30.7133, description: 'Türkiye\'nin turizm başkenti, muhteşem sahilleri ve antik kentleri ile ünlü.' },
  { name: 'Artvin', code: 8, region: 'Karadeniz', population: 170875, latitude: 41.1828, longitude: 41.8183, description: 'Doğu Karadeniz\'in doğa harikası, Kaçkar Dağları ve yaylaları ile ünlü.' },
  { name: 'Aydın', code: 9, region: 'Ege', population: 1134031, latitude: 37.8560, longitude: 27.8416, description: 'Kuşadası, Didim sahilleri ve antik kentleri ile tanınan Ege şehri.' },
  { name: 'Balıkesir', code: 10, region: 'Marmara', population: 1240285, latitude: 39.6484, longitude: 27.8826, description: 'Hem Marmara hem Ege denizine kıyısı olan şehir.' },
  { name: 'Bilecik', code: 11, region: 'Marmara', population: 228673, latitude: 40.0567, longitude: 30.0665, description: 'Osmanlı Devleti\'nin kuruluş yeri, tarihi öneme sahip şehir.' },
  { name: 'Bingöl', code: 12, region: 'Doğu Anadolu', population: 281205, latitude: 38.8854, longitude: 40.4980, description: 'Doğa güzellikleri ve kış turizmi ile bilinen şehir.' },
  { name: 'Bitlis', code: 13, region: 'Doğu Anadolu', population: 353988, latitude: 38.4006, longitude: 42.1095, description: 'Van Gölü kıyısında, tarihi kaleleri ile ünlü şehir.' },
  { name: 'Bolu', code: 14, region: 'Karadeniz', population: 316126, latitude: 40.7360, longitude: 31.6061, description: 'Abant Gölü, doğal güzellikleri ve aşçıları ile ünlü şehir.' },
  { name: 'Burdur', code: 15, region: 'Akdeniz', population: 270796, latitude: 37.7203, longitude: 30.2908, description: 'Burdur Gölü ve Sagalassos antik kenti ile bilinen şehir.' },
  { name: 'Bursa', code: 16, region: 'Marmara', population: 3147818, latitude: 40.1826, longitude: 29.0665, description: 'Osmanlı\'nın ilk başkenti, Uludağ ve İskender kebabı ile ünlü.' },
  { name: 'Çanakkale', code: 17, region: 'Marmara', population: 559383, latitude: 40.1553, longitude: 26.4142, description: 'Çanakkale Savaşları, Truva Antik Kenti ve boğazı ile ünlü.' },
  { name: 'Çankırı', code: 18, region: 'İç Anadolu', population: 195789, latitude: 40.6013, longitude: 33.6134, description: 'Tuz mağaraları ve tarihi eserleri ile bilinen şehir.' },
  { name: 'Çorum', code: 19, region: 'Karadeniz', population: 530864, latitude: 40.5506, longitude: 34.9556, description: 'Hititlerin başkenti Hattuşa ve leblebisi ile ünlü şehir.' },
  { name: 'Denizli', code: 20, region: 'Ege', population: 1037208, latitude: 37.7765, longitude: 29.0864, description: 'Pamukkale travertenleri ile dünya çapında ünlü şehir.' },
  { name: 'Diyarbakır', code: 21, region: 'Güneydoğu Anadolu', population: 1791373, latitude: 37.9144, longitude: 40.2306, description: 'Tarihi surları ve kültürel zenginlikleri ile ünlü kadim şehir.' },
  { name: 'Edirne', code: 22, region: 'Marmara', population: 413903, latitude: 41.6818, longitude: 26.5623, description: 'Selimiye Camii, Kırkpınar güreşleri ve ciğeri ile ünlü sınır şehri.' },
  { name: 'Elazığ', code: 23, region: 'Doğu Anadolu', population: 591497, latitude: 38.6810, longitude: 39.2264, description: 'Harput Kalesi ve Keban Barajı ile bilinen şehir.' },
  { name: 'Erzincan', code: 24, region: 'Doğu Anadolu', population: 236034, latitude: 39.7500, longitude: 39.5000, description: 'Ergan Dağı kayak merkezi ve tulum peyniri ile ünlü şehir.' },
  { name: 'Erzurum', code: 25, region: 'Doğu Anadolu', population: 758279, latitude: 39.9055, longitude: 41.2658, description: 'Palandöken kayak merkezi ve cağ kebabı ile ünlü şehir.' },
  { name: 'Eskişehir', code: 26, region: 'İç Anadolu', population: 888828, latitude: 39.7667, longitude: 30.5256, description: 'Üniversite şehri, Porsuk çayı ve lületaşı ile ünlü.' },
  { name: 'Gaziantep', code: 27, region: 'Güneydoğu Anadolu', population: 2130432, latitude: 37.0662, longitude: 37.3833, description: 'UNESCO gastronomi şehri, baklavası ve mutfak kültürü ile dünyaca ünlü.' },
  { name: 'Giresun', code: 28, region: 'Karadeniz', population: 453912, latitude: 40.9128, longitude: 38.3895, description: 'Fındıkları ve Giresun Adası ile ünlü Karadeniz şehri.' },
  { name: 'Gümüşhane', code: 29, region: 'Karadeniz', population: 151449, latitude: 40.4386, longitude: 39.5086, description: 'Karaca Mağarası ve pestili ile bilinen şehir.' },
  { name: 'Hakkari', code: 30, region: 'Doğu Anadolu', population: 280514, latitude: 37.5833, longitude: 43.7333, description: 'Yüksek dağları ve doğası ile bilinen sınır şehri.' },
  { name: 'Hatay', code: 31, region: 'Akdeniz', population: 1659320, latitude: 36.4018, longitude: 36.3498, description: 'Farklı kültürlerin buluşma noktası, mutfağı ve St. Pierre Kilisesi ile ünlü.' },
  { name: 'Isparta', code: 32, region: 'Akdeniz', population: 445325, latitude: 37.7648, longitude: 30.5566, description: 'Gül bahçeleri ve lavantaları ile ünlü şehir.' },
  { name: 'Mersin', code: 33, region: 'Akdeniz', population: 1868757, latitude: 36.8121, longitude: 34.6415, description: 'Türkiye\'nin en büyük limanlarından birine sahip Akdeniz şehri.' },
  { name: 'İstanbul', code: 34, region: 'Marmara', population: 15907951, latitude: 41.0082, longitude: 28.9784, description: 'İki kıtayı birleştiren dünya şehri, tarihi ve kültürel zenginliklerin başkenti.' },
  { name: 'İzmir', code: 35, region: 'Ege', population: 4425789, latitude: 38.4237, longitude: 27.1428, description: 'Ege\'nin incisi, Kordon boyu ve Efes Antik Kenti ile ünlü.' },
  { name: 'Kars', code: 36, region: 'Doğu Anadolu', population: 285410, latitude: 40.6167, longitude: 43.1000, description: 'Ani Harabeleri, kaşar peyniri ve kış güzellikleri ile ünlü sınır şehri.' },
  { name: 'Kastamonu', code: 37, region: 'Karadeniz', population: 383373, latitude: 41.3887, longitude: 33.7827, description: 'Tarihi konakları ve İnebolu ile ünlü şehir.' },
  { name: 'Kayseri', code: 38, region: 'İç Anadolu', population: 1421455, latitude: 38.7312, longitude: 35.4787, description: 'Erciyes Dağı, pastırması ve sucuğu ile ünlü şehir.' },
  { name: 'Kırklareli', code: 39, region: 'Marmara', population: 361836, latitude: 41.7333, longitude: 27.2167, description: 'İğneada longoz ormanları ve Trakya kültürü ile bilinen şehir.' },
  { name: 'Kırşehir', code: 40, region: 'İç Anadolu', population: 242938, latitude: 39.1425, longitude: 34.1709, description: 'Ahi Evran\'ın şehri, termal kaplıcaları ile bilinen şehir.' },
  { name: 'Kocaeli', code: 41, region: 'Marmara', population: 2033441, latitude: 40.8533, longitude: 29.8815, description: 'Türkiye\'nin sanayi başkenti, Gebze ve Kartepe ile ünlü.' },
  { name: 'Konya', code: 42, region: 'İç Anadolu', population: 2277017, latitude: 37.8746, longitude: 32.4932, description: 'Mevlana\'nın şehri, Selçuklu mimarisi ve etliekmek ile ünlü.' },
  { name: 'Kütahya', code: 43, region: 'Ege', population: 580701, latitude: 39.4167, longitude: 29.9833, description: 'Çini sanatı ve termal kaplıcaları ile ünlü şehir.' },
  { name: 'Malatya', code: 44, region: 'Doğu Anadolu', population: 812580, latitude: 38.3552, longitude: 38.3095, description: 'Kayısı diyarı, Arslantepe höyüğü ile UNESCO listesinde.' },
  { name: 'Manisa', code: 45, region: 'Ege', population: 1450616, latitude: 38.6191, longitude: 27.4289, description: 'Mesir macunu festivali ve Spil Dağı ile ünlü şehir.' },
  { name: 'Kahramanmaraş', code: 46, region: 'Akdeniz', population: 1168163, latitude: 37.5858, longitude: 36.9371, description: 'Dondurması ve biberli ile dünyaca ünlü şehir.' },
  { name: 'Mardin', code: 47, region: 'Güneydoğu Anadolu', population: 862757, latitude: 37.3212, longitude: 40.7245, description: 'Taş evleri ve Mezopotamya ovası manzarası ile büyüleyen kadim şehir.' },
  { name: 'Muğla', code: 48, region: 'Ege', population: 1021141, latitude: 37.2153, longitude: 28.3636, description: 'Bodrum, Marmaris, Fethiye gibi dünyaca ünlü tatil beldelerinin şehri.' },
  { name: 'Muş', code: 49, region: 'Doğu Anadolu', population: 408728, latitude: 38.9462, longitude: 41.7539, description: 'Lalezar ovasının şehri, doğal güzellikleri ile bilinen.' },
  { name: 'Nevşehir', code: 50, region: 'İç Anadolu', population: 303010, latitude: 38.6939, longitude: 34.6857, description: 'Kapadokya bölgesinin merkezi, peri bacaları ve balon turları ile dünyaca ünlü.' },
  { name: 'Niğde', code: 51, region: 'İç Anadolu', population: 362861, latitude: 37.9667, longitude: 34.6833, description: 'Aladağlar Milli Parkı ve elma bahçeleri ile bilinen şehir.' },
  { name: 'Ordu', code: 52, region: 'Karadeniz', population: 754198, latitude: 41.0000, longitude: 37.8833, description: 'Boztepe manzarası ve fındıkları ile ünlü Karadeniz kıyı şehri.' },
  { name: 'Rize', code: 53, region: 'Karadeniz', population: 348608, latitude: 41.0201, longitude: 40.5234, description: 'Çayı, yaylaları ve Ayder ile ünlü yeşil şehir.' },
  { name: 'Sakarya', code: 54, region: 'Marmara', population: 1042649, latitude: 40.6940, longitude: 30.4358, description: 'Sapanca Gölü ve Maşukiye şelaleleri ile ünlü doğa şehri.' },
  { name: 'Samsun', code: 55, region: 'Karadeniz', population: 1371274, latitude: 41.2928, longitude: 36.3313, description: '19 Mayıs\'ın başlangıç noktası, Bandırma Vapuru ile ünlü.' },
  { name: 'Siirt', code: 56, region: 'Güneydoğu Anadolu', population: 331670, latitude: 37.9333, longitude: 41.9500, description: 'Pervari balı ve Botan vadisi ile bilinen şehir.' },
  { name: 'Sinop', code: 57, region: 'Karadeniz', population: 218408, latitude: 42.0231, longitude: 35.1531, description: 'Türkiye\'nin en kuzey noktası, İnceburun ve doğal güzellikleri ile ünlü.' },
  { name: 'Sivas', code: 58, region: 'İç Anadolu', population: 646608, latitude: 39.7477, longitude: 37.0179, description: 'Divriği Ulu Camii (UNESCO), kangal balıklı kaplıca ile ünlü.' },
  { name: 'Tekirdağ', code: 59, region: 'Marmara', population: 1081065, latitude: 40.9833, longitude: 27.5167, description: 'Köftesi, rakısı ve Trakya bağları ile ünlü şehir.' },
  { name: 'Tokat', code: 60, region: 'Karadeniz', population: 612646, latitude: 40.3167, longitude: 36.5500, description: 'Niksar, Ballıca Mağarası ve kebabı ile bilinen şehir.' },
  { name: 'Trabzon', code: 61, region: 'Karadeniz', population: 808974, latitude: 41.0027, longitude: 39.7168, description: 'Sümela Manastırı, Uzungöl ve hamsi kültürü ile ünlü Karadeniz\'in incisi.' },
  { name: 'Tunceli', code: 62, region: 'Doğu Anadolu', population: 84660, latitude: 39.1079, longitude: 39.5401, description: 'Munzur Vadisi ve doğası ile büyüleyen şehir.' },
  { name: 'Şanlıurfa', code: 63, region: 'Güneydoğu Anadolu', population: 2115256, latitude: 37.1591, longitude: 38.7969, description: 'Göbeklitepe, Balıklıgöl ve peygamberler şehri olarak bilinen kadim kent.' },
  { name: 'Uşak', code: 64, region: 'Ege', population: 370509, latitude: 38.6823, longitude: 29.4082, description: 'Halı dokumacılığı ve Ulubey kanyonu ile ünlü şehir.' },
  { name: 'Van', code: 65, region: 'Doğu Anadolu', population: 1136757, latitude: 38.4891, longitude: 43.4089, description: 'Van Gölü, Van kedisi ve kahvaltı kültürü ile ünlü şehir.' },
  { name: 'Yozgat', code: 66, region: 'İç Anadolu', population: 424981, latitude: 39.8181, longitude: 34.8147, description: 'Çamlık Milli Parkı ve tarihi değerleri ile bilinen şehir.' },
  { name: 'Zonguldak', code: 67, region: 'Karadeniz', population: 596053, latitude: 41.4564, longitude: 31.7987, description: 'Türkiye\'nin maden şehri, taş kömürü ile ünlü.' },
  { name: 'Aksaray', code: 68, region: 'İç Anadolu', population: 421295, latitude: 38.3687, longitude: 34.0370, description: 'Ihlara Vadisi ve Kapadokya\'nın batı kapısı.' },
  { name: 'Bayburt', code: 69, region: 'Karadeniz', population: 84843, latitude: 40.2552, longitude: 40.2249, description: 'Türkiye\'nin en küçük illerinden, Bayburt kalesi ile bilinen.' },
  { name: 'Karaman', code: 70, region: 'İç Anadolu', population: 258838, latitude: 37.1759, longitude: 33.2287, description: 'Karamanoğulları Beyliği\'nin merkezi, tarihi öneme sahip şehir.' },
  { name: 'Kırıkkale', code: 71, region: 'İç Anadolu', population: 290104, latitude: 39.8468, longitude: 33.5153, description: 'Silah sanayi ve Ankara yakınlığı ile bilinen şehir.' },
  { name: 'Batman', code: 72, region: 'Güneydoğu Anadolu', population: 620278, latitude: 37.8812, longitude: 41.1351, description: 'Petrol üretimi ve Hasankeyf antik kenti ile bilinen şehir.' },
  { name: 'Şırnak', code: 73, region: 'Güneydoğu Anadolu', population: 542241, latitude: 37.4187, longitude: 42.4918, description: 'Cudi Dağı ve sınır ticareti ile bilinen şehir.' },
  { name: 'Bartın', code: 74, region: 'Karadeniz', population: 203351, latitude: 41.6344, longitude: 32.3375, description: 'Amasra kıyıları ve doğası ile ünlü Batı Karadeniz şehri.' },
  { name: 'Ardahan', code: 75, region: 'Doğu Anadolu', population: 97319, latitude: 41.1105, longitude: 42.7022, description: 'Çıldır Gölü ve kış turizmi ile bilinen sınır şehri.' },
  { name: 'Iğdır', code: 76, region: 'Doğu Anadolu', population: 203159, latitude: 39.9237, longitude: 44.0450, description: 'Ağrı Dağı manzarası ve kayısıları ile bilinen şehir.' },
  { name: 'Yalova', code: 77, region: 'Marmara', population: 296333, latitude: 40.6500, longitude: 29.2667, description: 'Termal kaplıcaları ve sahilleri ile ünlü küçük Marmara şehri.' },
  { name: 'Karabük', code: 78, region: 'Karadeniz', population: 248014, latitude: 41.2061, longitude: 32.6204, description: 'Safranbolu evleri (UNESCO) ile dünyaca ünlü şehir.' },
  { name: 'Kilis', code: 79, region: 'Güneydoğu Anadolu', population: 142541, latitude: 36.7184, longitude: 37.1212, description: 'Zeytinyağı ve sınır kültürü ile bilinen şehir.' },
  { name: 'Osmaniye', code: 80, region: 'Akdeniz', population: 559405, latitude: 37.0747, longitude: 36.2478, description: 'Kadirli, Kastabala antik kenti ile bilinen şehir.' },
  { name: 'Düzce', code: 81, region: 'Karadeniz', population: 392166, latitude: 40.8438, longitude: 31.1565, description: 'Doğa turizmi ve yaylaları ile bilinen Batı Karadeniz şehri.' },
];

const seedCities = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB Bağlandı');

    // Mevcut verileri temizle
    await City.deleteMany({});
    await Country.deleteMany({});
    console.log('Mevcut veriler temizlendi');

    // Önce ülkeyi oluştur
    const country = await Country.create(countryData);
    console.log(`Ülke eklendi: ${country.name} (${country.flag})`);

    // Şehirlere country referansı ekle ve toplu ekle
    const citiesWithCountry = cities.map(city => ({
      ...city,
      country: country._id,
    }));

    await City.insertMany(citiesWithCountry);
    console.log(`${citiesWithCountry.length} şehir başarıyla eklendi!`);

    await mongoose.connection.close();
    console.log('Veritabanı bağlantısı kapatıldı');
    process.exit(0);
  } catch (err) {
    console.error('Seed hatası:', err.message);
    process.exit(1);
  }
};

seedCities();
