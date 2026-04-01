require('dotenv').config();
const mongoose = require('mongoose');
const City = require('../models/City');
const Country = require('../models/Country');

const MONGO_URI = process.env.MONGO_URI;

// Ülkeler
const countries = [
  { name: 'Türkiye', code: 'TR', flag: '🇹🇷', imageUrl: '/images/countries/turkey.png', continent: 'Avrupa', capital: 'Ankara', population: 85372377 },
  { name: 'İtalya', code: 'IT', flag: '🇮🇹', imageUrl: '/images/countries/italy.png', continent: 'Avrupa', capital: 'Roma', population: 58850717 },
  { name: 'Japonya', code: 'JP', flag: '🇯🇵', imageUrl: '/images/countries/japan.png', continent: 'Asya', capital: 'Tokyo', population: 125700000 },
  { name: 'Fransa', code: 'FR', flag: '🇫🇷', imageUrl: '/images/countries/france.png', continent: 'Avrupa', capital: 'Paris', population: 67390000 },
  { name: 'İspanya', code: 'ES', flag: '🇪🇸', imageUrl: '/images/countries/spain.png', continent: 'Avrupa', capital: 'Madrid', population: 47420000 },
  { name: 'Brezilya', code: 'BR', flag: '🇧🇷', imageUrl: '/images/countries/brazil.png', continent: 'Güney Amerika', capital: 'Brasília', population: 214300000 },
  { name: 'Mısır', code: 'EG', flag: '🇪🇬', imageUrl: '/images/countries/egypt.png', continent: 'Afrika', capital: 'Kahire', population: 104000000 },
  { name: 'Avustralya', code: 'AU', flag: '🇦🇺', imageUrl: '/images/countries/australia.png', continent: 'Okyanusya', capital: 'Canberra', population: 26000000 },
  { name: 'Almanya', code: 'DE', flag: '🇩🇪', imageUrl: '/images/countries/germany.png', continent: 'Avrupa', capital: 'Berlin', population: 83200000 },
];

// Türkiye Şehirleri
const trCities = [
  { name: 'Adana', code: 1, region: 'Akdeniz', population: 2274106, latitude: 37.0, longitude: 35.3213, description: 'Akdeniz Bölgesi\'nin en büyük şehri, kebabı ve Seyhan Nehri ile ünlü.' },
  { name: 'Adıyaman', code: 2, region: 'Güneydoğu Anadolu', population: 635169, latitude: 37.7648, longitude: 38.2786, description: 'Nemrut Dağı\'nın bulunduğu tarihi şehir.' },
  { name: 'Afyonkarahisar', code: 3, region: 'Ege', population: 747555, latitude: 38.7507, longitude: 30.5567, description: 'Termal kaplıcaları, sucuğu ve kaymağı ile ünlü şehir.' },
  { name: 'Ağrı', code: 4, region: 'Doğu Anadolu', population: 510626, latitude: 39.7191, longitude: 43.0503, description: 'Türkiye\'nin en yüksek dağı Ağrı Dağı\'nın bulunduğu şehir.' },
  { name: 'Amasya', code: 5, region: 'Karadeniz', population: 338267, latitude: 40.6499, longitude: 35.8353, description: 'Yeşilırmak kıyısındaki Osmanlı konakları ile ünlü tarihi şehir.' },
  { name: 'Ankara', code: 6, region: 'İç Anadolu', population: 5747325, latitude: 39.9334, longitude: 32.8597, description: 'Türkiye\'nin başkenti, siyasi ve kültürel merkez.' },
  { name: 'Antalya', code: 7, region: 'Akdeniz', population: 2619832, latitude: 36.8969, longitude: 30.7133, description: 'Türkiye\'nin turizm başkenti, muhteşem sahilleri ve antik kentleri ile ünlü.' },
  { name: 'Artvin', code: 8, region: 'Karadeniz', population: 170875, latitude: 41.1828, longitude: 41.8183, description: 'Doğu Karadeniz\'in doğa harikası, Kaçkar Dağları ve yaylaları ile ünlü.' },
  { name: 'Aydın', code: 9, region: 'Ege', population: 1134031, latitude: 37.856, longitude: 27.8416, description: 'Kuşadası, Didim sahilleri ve antik kentleri ile tanınan Ege şehri.' },
  { name: 'Balıkesir', code: 10, region: 'Marmara', population: 1240285, latitude: 39.6484, longitude: 27.8826, description: 'Hem Marmara hem Ege denizine kıyısı olan şehir.' },
  { name: 'Bilecik', code: 11, region: 'Marmara', population: 228673, latitude: 40.0567, longitude: 30.0665, description: 'Osmanlı Devleti\'nin kuruluş yeri, tarihi öneme sahip şehir.' },
  { name: 'Bingöl', code: 12, region: 'Doğu Anadolu', population: 281205, latitude: 38.8854, longitude: 40.498, description: 'Doğa güzellikleri ve kış turizmi ile bilinen şehir.' },
  { name: 'Bitlis', code: 13, region: 'Doğu Anadolu', population: 353988, latitude: 38.4006, longitude: 42.1095, description: 'Van Gölü kıyısında, tarihi kaleleri ile ünlü şehir.' },
  { name: 'Bolu', code: 14, region: 'Karadeniz', population: 316126, latitude: 40.736, longitude: 31.6061, description: 'Abant Gölü, doğal güzellikleri ve aşçıları ile ünlü şehir.' },
  { name: 'Burdur', code: 15, region: 'Akdeniz', population: 270796, latitude: 37.7203, longitude: 30.2908, description: 'Burdur Gölü ve Sagalassos antik kenti ile bilinen şehir.' },
  { name: 'Bursa', code: 16, region: 'Marmara', population: 3147818, latitude: 40.1826, longitude: 29.0665, description: 'Osmanlı\'nın ilk başkenti, Uludağ ve İskender kebabı ile ünlü.' },
  { name: 'Çanakkale', code: 17, region: 'Marmara', population: 559383, latitude: 40.1553, longitude: 26.4142, description: 'Çanakkale Savaşları, Truva Antik Kenti ve boğazı ile ünlü.' },
  { name: 'Çankırı', code: 18, region: 'İç Anadolu', population: 195789, latitude: 40.6013, longitude: 33.6134, description: 'Tuz mağaraları ve tarihi eserleri ile bilinen şehir.' },
  { name: 'Çorum', code: 19, region: 'Karadeniz', population: 530864, latitude: 40.5506, longitude: 34.9556, description: 'Hititlerin başkenti Hattuşa ve leblebisi ile ünlü şehir.' },
  { name: 'Denizli', code: 20, region: 'Ege', population: 1037208, latitude: 37.7765, longitude: 29.0864, description: 'Pamukkale travertenleri ile dünya çapında ünlü şehir.' },
  { name: 'Diyarbakır', code: 21, region: 'Güneydoğu Anadolu', population: 1791373, latitude: 37.9144, longitude: 40.2306, description: 'Tarihi surları ve kültürel zenginlikleri ile ünlü kadim şehir.' },
  { name: 'Edirne', code: 22, region: 'Marmara', population: 413903, latitude: 41.6818, longitude: 26.5623, description: 'Selimiye Camii, Kırkpınar güreşleri ve ciğeri ile ünlü sınır şehri.' },
  { name: 'Elazığ', code: 23, region: 'Doğu Anadolu', population: 591497, latitude: 38.681, longitude: 39.2264, description: 'Harput Kalesi ve Keban Barajı ile bilinen şehir.' },
  { name: 'Erzincan', code: 24, region: 'Doğu Anadolu', population: 236034, latitude: 39.75, longitude: 39.5, description: 'Ergan Dağı kayak merkezi ve tulum peyniri ile ünlü şehir.' },
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
  { name: 'Kars', code: 36, region: 'Doğu Anadolu', population: 285410, latitude: 40.6167, longitude: 43.1, description: 'Ani Harabeleri, kaşar peyniri ve kış güzellikleri ile ünlü sınır şehri.' },
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
  { name: 'Ordu', code: 52, region: 'Karadeniz', population: 754198, latitude: 41.0, longitude: 37.8833, description: 'Boztepe manzarası ve fındıkları ile ünlü Karadeniz kıyı şehri.' },
  { name: 'Rize', code: 53, region: 'Karadeniz', population: 348608, latitude: 41.0201, longitude: 40.5234, description: 'Çayı, yaylaları ve Ayder ile ünlü yeşil şehir.' },
  { name: 'Sakarya', code: 54, region: 'Marmara', population: 1042649, latitude: 40.694, longitude: 30.4358, description: 'Sapanca Gölü ve Maşukiye şelaleleri ile ünlü doğa şehri.' },
  { name: 'Samsun', code: 55, region: 'Karadeniz', population: 1371274, latitude: 41.2928, longitude: 36.3313, description: '19 Mayıs\'ın başlangıç noktası, Bandırma Vapuru ile ünlü.' },
  { name: 'Siirt', code: 56, region: 'Güneydoğu Anadolu', population: 331670, latitude: 37.9333, longitude: 41.95, description: 'Pervari balı ve Botan vadisi ile bilinen şehir.' },
  { name: 'Sinop', code: 57, region: 'Karadeniz', population: 218408, latitude: 42.0231, longitude: 35.1531, description: 'Türkiye\'nin en kuzey noktası, İnceburun ve doğal güzellikleri ile ünlü.' },
  { name: 'Sivas', code: 58, region: 'İç Anadolu', population: 646608, latitude: 39.7477, longitude: 37.0179, description: 'Divriği Ulu Camii (UNESCO), kangal balıklı kaplıca ile ünlü.' },
  { name: 'Tekirdağ', code: 59, region: 'Marmara', population: 1081065, latitude: 40.9833, longitude: 27.5167, description: 'Köftesi, rakısı ve Trakya bağları ile ünlü şehir.' },
  { name: 'Tokat', code: 60, region: 'Karadeniz', population: 612646, latitude: 40.3167, longitude: 36.55, description: 'Niksar, Ballıca Mağarası ve kebabı ile bilinen şehir.' },
  { name: 'Trabzon', code: 61, region: 'Karadeniz', population: 808974, latitude: 41.0027, longitude: 39.7168, description: 'Sümela Manastırı, Uzungöl ve hamsi kültürü ile ünlü Karadeniz\'in incisi.' },
  { name: 'Tunceli', code: 62, region: 'Doğu Anadolu', population: 84660, latitude: 39.1079, longitude: 39.5401, description: 'Munzur Vadisi ve doğası ile büyüleyen şehir.' },
  { name: 'Şanlıurfa', code: 63, region: 'Güneydoğu Anadolu', population: 2115256, latitude: 37.1591, longitude: 38.7969, description: 'Göbeklitepe, Balıklıgöl ve peygamberler şehri olarak bilinen kadim kent.' },
  { name: 'Uşak', code: 64, region: 'Ege', population: 370509, latitude: 38.6823, longitude: 29.4082, description: 'Halı dokumacılığı ve Ulubey kanyonu ile ünlü şehir.' },
  { name: 'Van', code: 65, region: 'Doğu Anadolu', population: 1136757, latitude: 38.4891, longitude: 43.4089, description: 'Van Gölü, Van kedisi ve kahvaltı kültürü ile ünlü şehir.' },
  { name: 'Yozgat', code: 66, region: 'İç Anadolu', population: 424981, latitude: 39.8181, longitude: 34.8147, description: 'Çamlık Milli Parkı ve tarihi değerleri ile bilinen şehir.' },
  { name: 'Zonguldak', code: 67, region: 'Karadeniz', population: 596053, latitude: 41.4564, longitude: 31.7987, description: 'Türkiye\'nin maden şehri, taş kömürü ile ünlü.' },
  { name: 'Aksaray', code: 68, region: 'İç Anadolu', population: 421295, latitude: 38.3687, longitude: 34.037, description: 'Ihlara Vadisi ve Kapadokya\'nın batı kapısı.' },
  { name: 'Bayburt', code: 69, region: 'Karadeniz', population: 84843, latitude: 40.2552, longitude: 40.2249, description: 'Türkiye\'nin en küçük illerinden, Bayburt kalesi ile bilinen.' },
  { name: 'Karaman', code: 70, region: 'İç Anadolu', population: 258838, latitude: 37.1759, longitude: 33.2287, description: 'Karamanoğulları Beyliği\'nin merkezi, tarihi öneme sahip şehir.' },
  { name: 'Kırıkkale', code: 71, region: 'İç Anadolu', population: 290104, latitude: 39.8468, longitude: 33.5153, description: 'Silah sanayi ve Ankara yakınlığı ile bilinen şehir.' },
  { name: 'Batman', code: 72, region: 'Güneydoğu Anadolu', population: 620278, latitude: 37.8812, longitude: 41.1351, description: 'Petrol üretimi ve Hasankeyf antik kenti ile bilinen şehir.' },
  { name: 'Şırnak', code: 73, region: 'Güneydoğu Anadolu', population: 542241, latitude: 37.4187, longitude: 42.4918, description: 'Cudi Dağı ve sınır ticareti ile bilinen şehir.' },
  { name: 'Bartın', code: 74, region: 'Karadeniz', population: 203351, latitude: 41.6344, longitude: 32.3375, description: 'Amasra kıyıları ve doğası ile ünlü Batı Karadeniz şehri.' },
  { name: 'Ardahan', code: 75, region: 'Doğu Anadolu', population: 97319, latitude: 41.1105, longitude: 42.7022, description: 'Çıldır Gölü ve kış turizmi ile bilinen sınır şehri.' },
  { name: 'Iğdır', code: 76, region: 'Doğu Anadolu', population: 203159, latitude: 39.9237, longitude: 44.045, description: 'Ağrı Dağı manzarası ve kayısıları ile bilinen şehir.' },
  { name: 'Yalova', code: 77, region: 'Marmara', population: 296333, latitude: 40.65, longitude: 29.2667, description: 'Termal kaplıcaları ve sahilleri ile ünlü küçük Marmara şehri.' },
  { name: 'Karabük', code: 78, region: 'Karadeniz', population: 248014, latitude: 41.2061, longitude: 32.6204, description: 'Safranbolu evleri (UNESCO) ile dünyaca ünlü şehir.' },
  { name: 'Kilis', code: 79, region: 'Güneydoğu Anadolu', population: 142541, latitude: 36.7184, longitude: 37.1212, description: 'Zeytinyağı ve sınır kültürü ile bilinen şehir.' },
  { name: 'Osmaniye', code: 80, region: 'Akdeniz', population: 559405, latitude: 37.0747, longitude: 36.2478, description: 'Kadirli, Kastabala antik kenti ile bilinen şehir.' },
  { name: 'Düzce', code: 81, region: 'Karadeniz', population: 392166, latitude: 40.8438, longitude: 31.1565, description: 'Doğa turizmi ve yaylaları ile bilinen Batı Karadeniz şehri.' },
];

// İtalya Şehirleri
const itCities = [
  { name: 'Roma', code: 1, region: 'Lazio', population: 2873000, latitude: 41.9028, longitude: 12.4964, description: 'İtalya\'nın başkenti, Kolezyum ve Vatikan ile dünyaca ünlü.' },
  { name: 'Milano', code: 2, region: 'Lombardia', population: 1396000, latitude: 45.4642, longitude: 9.1900, description: 'Moda ve tasarım başkenti, Duomo Katedrali ile ünlü.' },
  { name: 'Napoli', code: 3, region: 'Campania', population: 967000, latitude: 40.8518, longitude: 14.2681, description: 'Pizzanın anavatanı, Vezüv Yanardağı manzarası ile ünlü.' },
  { name: 'Torino', code: 4, region: 'Piemonte', population: 875000, latitude: 45.0703, longitude: 7.6869, description: 'Otomobil endüstrisi ve çikolatasıyla ünlü şehir.' },
  { name: 'Floransa', code: 5, region: 'Toscana', population: 382000, latitude: 43.7696, longitude: 11.2558, description: 'Rönesans\'ın doğduğu şehir, sanat ve mimari hazinesi.' },
  { name: 'Venedik', code: 6, region: 'Veneto', population: 261000, latitude: 45.4408, longitude: 12.3155, description: 'Kanallar şehri, gondolları ve San Marco Meydanı ile ünlü.' },
  { name: 'Bologna', code: 7, region: 'Emilia-Romagna', population: 394000, latitude: 44.4949, longitude: 11.3426, description: 'İtalyan mutfağının kalbi, dünyanın en eski üniversitesinin şehri.' },
  { name: 'Palermo', code: 8, region: 'Sicilia', population: 663000, latitude: 38.1157, longitude: 13.3615, description: 'Sicilya\'nın başkenti, Arap-Norman mimarisi ile ünlü.' },
  { name: 'Verona', code: 9, region: 'Veneto', population: 259000, latitude: 45.4384, longitude: 10.9916, description: 'Romeo ve Juliet\'in şehri, antik Roma arenası ile ünlü.' },
  { name: 'Cenova', code: 10, region: 'Liguria', population: 580000, latitude: 44.4056, longitude: 8.9463, description: 'Kristof Kolomb\'un doğduğu şehir, Akdeniz limanı.' },
];

// Japonya Şehirleri
const jpCities = [
  { name: 'Tokyo', code: 1, region: 'Kanto', population: 13960000, latitude: 35.6762, longitude: 139.6503, description: 'Japonya\'nın başkenti, dünyanın en büyük metropollerinden biri.' },
  { name: 'Osaka', code: 2, region: 'Kansai', population: 2753000, latitude: 34.6937, longitude: 135.5023, description: 'Sokak yemekleri, Osaka Kalesi ve eğlence kültürü ile ünlü.' },
  { name: 'Kyoto', code: 3, region: 'Kansai', population: 1475000, latitude: 35.0116, longitude: 135.7681, description: 'Antik tapınakları, geyşa kültürü ve Zen bahçeleri ile ünlü eski başkent.' },
  { name: 'Yokohama', code: 4, region: 'Kanto', population: 3749000, latitude: 35.4437, longitude: 139.6380, description: 'Japonya\'nın en büyük liman şehri, Chinatown ile ünlü.' },
  { name: 'Nagoya', code: 5, region: 'Chubu', population: 2296000, latitude: 35.1815, longitude: 136.9066, description: 'Otomobil endüstrisi merkezi, Nagoya Kalesi ile ünlü.' },
  { name: 'Sapporo', code: 6, region: 'Hokkaido', population: 1973000, latitude: 43.0618, longitude: 141.3545, description: 'Kış festivali, bira fabrikaları ve ramen ile ünlü.' },
  { name: 'Kobe', code: 7, region: 'Kansai', population: 1537000, latitude: 34.6901, longitude: 135.1956, description: 'Dünyaca ünlü Kobe bifteği ve limanı ile bilinen şehir.' },
  { name: 'Hiroshima', code: 8, region: 'Chugoku', population: 1199000, latitude: 34.3853, longitude: 132.4553, description: 'Barış Anıtı Parkı ve Miyajima Adası ile ünlü tarihi şehir.' },
  { name: 'Nara', code: 9, region: 'Kansai', population: 360000, latitude: 34.6851, longitude: 135.8048, description: 'Antik tapınakları ve serbest geyikleriyle ünlü eski başkent.' },
  { name: 'Fukuoka', code: 10, region: 'Kyushu', population: 1603000, latitude: 33.5904, longitude: 130.4017, description: 'Hakata ramen ve gece tezgahları ile ünlü, Güney Japonya\'nın merkezi.' },
];

// Fransa Şehirleri
const frCities = [
  { name: 'Paris', code: 1, region: 'Île-de-France', population: 2161000, latitude: 48.8566, longitude: 2.3522, description: 'Işıklar şehri, Eyfel Kulesi ve Louvre Müzesi ile dünyaca ünlü.' },
  { name: 'Marsilya', code: 2, region: 'Provence-Alpes', population: 870000, latitude: 43.2965, longitude: 5.3698, description: 'Fransa\'nın en büyük liman şehri, Akdeniz kültürü ile ünlü.' },
  { name: 'Lyon', code: 3, region: 'Auvergne-Rhône-Alpes', population: 516000, latitude: 45.7640, longitude: 4.8357, description: 'Gastronomi başkenti, UNESCO korumasındaki tarihi merkezi ile ünlü.' },
  { name: 'Toulouse', code: 4, region: 'Occitanie', population: 479000, latitude: 43.6047, longitude: 1.4442, description: 'Pembe şehir, havacılık endüstrisi ve Airbus merkezi.' },
  { name: 'Nice', code: 5, region: 'Provence-Alpes', population: 342000, latitude: 43.7102, longitude: 7.2620, description: 'Côte d\'Azur\'ün incisi, Promenade des Anglais ile ünlü.' },
  { name: 'Nantes', code: 6, region: 'Pays de la Loire', population: 309000, latitude: 47.2184, longitude: -1.5536, description: 'Loire Vadisi\'nin girişi, Jules Verne\'nin doğduğu şehir.' },
  { name: 'Strasbourg', code: 7, region: 'Grand Est', population: 280000, latitude: 48.5734, longitude: 7.7521, description: 'Avrupa Parlamentosu\'nun şehri, Noel pazarları ile ünlü.' },
  { name: 'Bordeaux', code: 8, region: 'Nouvelle-Aquitaine', population: 254000, latitude: 44.8378, longitude: -0.5792, description: 'Dünyaca ünlü şarapları ve zarif mimarisi ile bilinen şehir.' },
  { name: 'Lille', code: 9, region: 'Hauts-de-France', population: 232000, latitude: 50.6292, longitude: 3.0573, description: 'Kuzey Fransa\'nın kültür merkezi, Flaman etkili mimarisi ile ünlü.' },
  { name: 'Montpellier', code: 10, region: 'Occitanie', population: 285000, latitude: 43.6108, longitude: 3.8767, description: 'Genç ve dinamik üniversite şehri, Akdeniz iklimi ile ünlü.' },
];

// İspanya Şehirleri
const esCities = [
  { name: 'Madrid', code: 1, region: 'Madrid', population: 3223000, latitude: 40.4168, longitude: -3.7038, description: 'İspanya\'nın başkenti, Prado Müzesi ve kraliyet sarayı ile ünlü.' },
  { name: 'Barcelona', code: 2, region: 'Cataluña', population: 1621000, latitude: 41.3874, longitude: 2.1686, description: 'Gaudí\'nin eserleri, Sagrada Familia ve La Rambla ile dünyaca ünlü.' },
  { name: 'Valencia', code: 3, region: 'Valencia', population: 794000, latitude: 39.4699, longitude: -0.3763, description: 'Paella\'nın anavatanı, Sanat ve Bilim Şehri ile ünlü.' },
  { name: 'Sevilla', code: 4, region: 'Andalucía', population: 688000, latitude: 37.3891, longitude: -5.9845, description: 'Flamenko, Alcázar Sarayı ve gotik katedralı ile ünlü.' },
  { name: 'Bilbao', code: 5, region: 'País Vasco', population: 346000, latitude: 43.2630, longitude: -2.9350, description: 'Guggenheim Müzesi ile yeniden doğan endüstriyel şehir.' },
  { name: 'Malaga', code: 6, region: 'Andalucía', population: 578000, latitude: 36.7213, longitude: -4.4214, description: 'Picasso\'nun doğduğu şehir, Costa del Sol sahilleri ile ünlü.' },
  { name: 'Granada', code: 7, region: 'Andalucía', population: 232000, latitude: 37.1773, longitude: -3.5986, description: 'Alhambra Sarayı ile dünyaca ünlü, Endülüs kültürünün kalbi.' },
  { name: 'Zaragoza', code: 8, region: 'Aragón', population: 674000, latitude: 41.6488, longitude: -0.8891, description: 'Pilar Bazilikası ve Roma dönemine ait kalıntıları ile ünlü.' },
  { name: 'San Sebastián', code: 9, region: 'País Vasco', population: 187000, latitude: 43.3183, longitude: -1.9812, description: 'Gastronomi başkenti, La Concha plajı ile ünlü sahil şehri.' },
  { name: 'Toledo', code: 10, region: 'Castilla-La Mancha', population: 84000, latitude: 39.8628, longitude: -4.0273, description: 'Üç kültürün şehri, ortaçağ surları ve El Greco\'nun eserleri ile ünlü.' },
];

// Brezilya Şehirleri
const brCities = [
  { name: 'São Paulo', code: 1, region: 'Güneydoğu', population: 12330000, latitude: -23.5505, longitude: -46.6333, description: 'Güney Amerika\'nın en büyük şehri, finans ve kültür merkezi.' },
  { name: 'Rio de Janeiro', code: 2, region: 'Güneydoğu', population: 6748000, latitude: -22.9068, longitude: -43.1729, description: 'Kurtarıcı İsa heykeli, Copacabana plajı ve karnaval ile dünyaca ünlü.' },
  { name: 'Brasília', code: 3, region: 'Orta-Batı', population: 3056000, latitude: -15.7975, longitude: -47.8919, description: 'Brezilya\'nın başkenti, modernist mimarisi ile UNESCO listesinde.' },
  { name: 'Salvador', code: 4, region: 'Kuzeydoğu', population: 2886000, latitude: -12.9714, longitude: -38.5124, description: 'Afro-Brezilya kültürünün kalbi, renkli sömürge dönemi mimarisi ile ünlü.' },
  { name: 'Fortaleza', code: 5, region: 'Kuzeydoğu', population: 2686000, latitude: -3.7319, longitude: -38.5267, description: 'Tropikal sahilleri ve forró müziği ile ünlü kuzeydoğu şehri.' },
  { name: 'Belo Horizonte', code: 6, region: 'Güneydoğu', population: 2521000, latitude: -19.9167, longitude: -43.9345, description: 'Pampulha bölgesi ve Oscar Niemeyer eserleri ile ünlü.' },
  { name: 'Manaus', code: 7, region: 'Kuzey', population: 2220000, latitude: -3.1190, longitude: -60.0217, description: 'Amazon ormanlarının kapısı, Teatro Amazonas ile ünlü.' },
  { name: 'Curitiba', code: 8, region: 'Güney', population: 1948000, latitude: -25.4284, longitude: -49.2733, description: 'Brezilya\'nın en yeşil şehri, şehir planlaması modeli.' },
  { name: 'Recife', code: 9, region: 'Kuzeydoğu', population: 1654000, latitude: -8.0476, longitude: -34.8770, description: 'Brezilya\'nın Venedik\'i, köprüleri ve plajları ile ünlü.' },
  { name: 'Porto Alegre', code: 10, region: 'Güney', population: 1488000, latitude: -30.0346, longitude: -51.2177, description: 'Güney Brezilya\'nın kültür başkenti, churrasco geleneği ile ünlü.' },
];

// Mısır Şehirleri
const egCities = [
  { name: 'Kahire', code: 1, region: 'Aşağı Mısır', population: 10230000, latitude: 30.0444, longitude: 31.2357, description: 'Mısır\'ın başkenti, piramitlere komşu kadim megapol.' },
  { name: 'İskenderiye', code: 2, region: 'Aşağı Mısır', population: 5200000, latitude: 31.2001, longitude: 29.9187, description: 'Antik dünyanın feneri, Akdeniz kıyısındaki kültür şehri.' },
  { name: 'Giza', code: 3, region: 'Aşağı Mısır', population: 4100000, latitude: 30.0131, longitude: 31.2089, description: 'Büyük Piramitler ve Sfenks\'in bulunduğu efsanevi şehir.' },
  { name: 'Luxor', code: 4, region: 'Yukarı Mısır', population: 507000, latitude: 25.6872, longitude: 32.6396, description: 'Krallar Vadisi ve Karnak Tapınağı ile dünyanın en büyük açık hava müzesi.' },
  { name: 'Aswan', code: 5, region: 'Yukarı Mısır', population: 350000, latitude: 24.0889, longitude: 32.8998, description: 'Nil\'in incisi, Aswan Barajı ve Philae Tapınağı ile ünlü.' },
  { name: 'Sharm El Sheikh', code: 6, region: 'Sina', population: 73000, latitude: 27.9158, longitude: 34.3300, description: 'Kızıldeniz\'in turizm cenneti, dalış sporları ile dünyaca ünlü.' },
  { name: 'Hurghada', code: 7, region: 'Kızıldeniz', population: 260000, latitude: 27.2579, longitude: 33.8116, description: 'Mercan resifleri ve turkuaz sahilleri ile ünlü tatil beldesi.' },
  { name: 'Port Said', code: 8, region: 'Aşağı Mısır', population: 760000, latitude: 31.2565, longitude: 32.2841, description: 'Süveyş Kanalı\'nın Akdeniz girişindeki liman şehri.' },
  { name: 'Süveyş', code: 9, region: 'Aşağı Mısır', population: 728000, latitude: 29.9668, longitude: 32.5498, description: 'Dünyaca ünlü Süveyş Kanalı\'nın yer aldığı stratejik şehir.' },
  { name: 'Fayyum', code: 10, region: 'Yukarı Mısır', population: 350000, latitude: 29.3084, longitude: 30.8428, description: 'Antik göl şehri, Wadi El Rayan şelaleleri ile ünlü.' },
];

// Avustralya Şehirleri
const auCities = [
  { name: 'Sydney', code: 1, region: 'Yeni Güney Galler', population: 5312000, latitude: -33.8688, longitude: 151.2093, description: 'Opera Binası ve Harbour Bridge ile ikonik dünya şehri.' },
  { name: 'Melbourne', code: 2, region: 'Victoria', population: 5078000, latitude: -37.8136, longitude: 144.9631, description: 'Kahve kültürü, sokak sanatı ve spor etkinlikleri ile ünlü.' },
  { name: 'Brisbane', code: 3, region: 'Queensland', population: 2560000, latitude: -27.4698, longitude: 153.0251, description: 'Güneşli iklimi ve South Bank parkları ile ünlü.' },
  { name: 'Perth', code: 4, region: 'Batı Avustralya', population: 2085000, latitude: -31.9505, longitude: 115.8605, description: 'Dünyanın en izole büyük şehri, muhteşem sahilleri ile ünlü.' },
  { name: 'Adelaide', code: 5, region: 'Güney Avustralya', population: 1376000, latitude: -34.9285, longitude: 138.6007, description: 'Şarap bölgeleri ve festival kültürü ile ünlü.' },
  { name: 'Canberra', code: 6, region: 'ACT', population: 453000, latitude: -35.2809, longitude: 149.1300, description: 'Avustralya\'nın başkenti, planlı şehir mimarisi ile ünlü.' },
  { name: 'Gold Coast', code: 7, region: 'Queensland', population: 679000, latitude: -28.0167, longitude: 153.4000, description: 'Sörf cenneti, tema parkları ve gökdelenleri ile ünlü tatil şehri.' },
  { name: 'Hobart', code: 8, region: 'Tazmanya', population: 238000, latitude: -42.8821, longitude: 147.3272, description: 'Tazmanya\'nın başkenti, MONA müzesi ve doğası ile ünlü.' },
  { name: 'Darwin', code: 9, region: 'Kuzey Bölgesi', population: 147000, latitude: -12.4634, longitude: 130.8456, description: 'Tropikal iklimi, Kakadu Milli Parkı yakınlığı ile ünlü.' },
  { name: 'Cairns', code: 10, region: 'Queensland', population: 153000, latitude: -16.9186, longitude: 145.7781, description: 'Büyük Set Resifi\'ne açılan kapı, tropikal cennet.' },
];

// Almanya Şehirleri
const deCities = [
  { name: 'Berlin', code: 1, region: 'Berlin', population: 3645000, latitude: 52.5200, longitude: 13.4050, description: 'Almanya\'nın başkenti, Brandenburg Kapısı ve Berlin Duvarı ile ünlü.' },
  { name: 'Münih', code: 2, region: 'Bavyera', population: 1472000, latitude: 48.1351, longitude: 11.5820, description: 'Oktoberfest, BMW ve Bavyera kültürü ile dünyaca ünlü.' },
  { name: 'Hamburg', code: 3, region: 'Hamburg', population: 1899000, latitude: 53.5511, longitude: 9.9937, description: 'Almanya\'nın en büyük liman şehri, Elbphilharmonie ile ünlü.' },
  { name: 'Frankfurt', code: 4, region: 'Hessen', population: 753000, latitude: 50.1109, longitude: 8.6821, description: 'Avrupa\'nın finans başkenti, gökdelenleri ile Mainhattan olarak bilinir.' },
  { name: 'Köln', code: 5, region: 'Kuzey Ren-Vestfalya', population: 1084000, latitude: 50.9375, longitude: 6.9603, description: 'Gotik katedrali ve karnavalı ile ünlü Ren kıyısı şehri.' },
  { name: 'Stuttgart', code: 6, region: 'Baden-Württemberg', population: 634000, latitude: 48.7758, longitude: 9.1829, description: 'Mercedes-Benz ve Porsche\'nin anavatanı, otomotiv şehri.' },
  { name: 'Düsseldorf', code: 7, region: 'Kuzey Ren-Vestfalya', population: 619000, latitude: 51.2277, longitude: 6.7735, description: 'Moda, sanat ve Ren nehri kıyısındaki zarif şehir.' },
  { name: 'Dresden', code: 8, region: 'Saksonya', population: 556000, latitude: 51.0504, longitude: 13.7373, description: 'Barok mimarisi ile Elbe\'nin Floransa\'sı olarak bilinen şehir.' },
  { name: 'Heidelberg', code: 9, region: 'Baden-Württemberg', population: 162000, latitude: 49.3988, longitude: 8.6724, description: 'Romantik kalesi ve Almanya\'nın en eski üniversitesi ile ünlü.' },
  { name: 'Nürnberg', code: 10, region: 'Bavyera', population: 518000, latitude: 49.4521, longitude: 11.0767, description: 'Ortaçağ surları, Noel pazarı ve sosisleri ile ünlü.' },
];

// Ülke kodu -> şehir dizisi eşleşmesi
const citiesByCountry = {
  TR: trCities,
  IT: itCities,
  JP: jpCities,
  FR: frCities,
  ES: esCities,
  BR: brCities,
  EG: egCities,
  AU: auCities,
  DE: deCities,
};

const seedAll = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB Bağlandı');

    // Temizlik
    await Country.deleteMany({});
    await City.deleteMany({});
    console.log('Koleksiyonlar temizlendi');

    // Ülkeleri Ekle
    const createdCountries = await Country.insertMany(countries);
    console.log(`${createdCountries.length} ülke eklendi`);

    // Her ülke için şehirleri ekle
    for (const country of createdCountries) {
      const countryCities = citiesByCountry[country.code];
      if (countryCities && countryCities.length > 0) {
        const citiesWithId = countryCities.map(city => ({
          ...city,
          country: country._id,
        }));
        await City.insertMany(citiesWithId);
        console.log(`  ${country.flag} ${country.name}: ${citiesWithId.length} şehir eklendi`);
      } else {
        console.log(`  ${country.flag} ${country.name}: Şehir verisi yok, atlandı`);
      }
    }

    console.log('\nSeed işlemi başarıyla tamamlandı!');
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('Seed hatası:', err.message);
    process.exit(1);
  }
};

seedAll();
