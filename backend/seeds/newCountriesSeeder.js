require('dotenv').config();
const mongoose = require('mongoose');
const Country = require('../models/Country');
const City = require('../models/City');
const Place = require('../models/Place');

const MONGO_URI = process.env.MONGO_URI;

// ════════════════════════════════════════════════════════════
//  VERİ
// ════════════════════════════════════════════════════════════

const newData = [

  // ──────────────────── ABD ────────────────────
  {
    country: { name: 'Amerika Birleşik Devletleri', code: 'US', flag: '🇺🇸', continent: 'Kuzey Amerika', capital: 'Washington D.C.', population: 331000000 },
    cities: [
      { name: 'New York', code: 1, region: 'Kuzeydoğu', population: 8336817, latitude: 40.7128, longitude: -74.0060, description: 'Dünyanın en kozmopolit şehri, Özgürlük Heykeli ve Times Square ile ünlü.' },
      { name: 'Los Angeles', code: 2, region: 'Batı', population: 3979576, latitude: 34.0522, longitude: -118.2437, description: 'Hollywood, güneşli sahilleri ve eğlence endüstrisinin başkenti.' },
      { name: 'Chicago', code: 3, region: 'Orta Batı', population: 2693976, latitude: 41.8781, longitude: -87.6298, description: 'Gökdelenlerin anavatanı, müzik ve jazz kültürüyle ünlü Göl Kıyısı şehri.' },
      { name: 'Las Vegas', code: 4, region: 'Batı', population: 641903, latitude: 36.1699, longitude: -115.1398, description: 'Dünyanın eğlence başkenti, casino ve gösterileriyle ünlü çöl şehri.' },
      { name: 'Miami', code: 5, region: 'Güneydoğu', population: 467963, latitude: 25.7617, longitude: -80.1918, description: 'Latin kültürü, Art Deco mimarisi ve tropikal plajlarıyla ünlü.' },
      { name: 'San Francisco', code: 6, region: 'Batı', population: 883305, latitude: 37.7749, longitude: -122.4194, description: 'Golden Gate Köprüsü, teknoloji merkezi ve renkli Victorian evleriyle ünlü.' },
    ],
    places: [
      { cityName: 'New York', name: 'Özgürlük Heykeli', slug: 'ozgurluk-heykeli-ny', category: 'Tarihi', shortDescription: 'Amerikan özgürlüğünün simgesi, Liberty Adası\'ndaki ikonik heykel.', description: 'Özgürlük Heykeli, 1886\'da Fransa\'nın ABD\'ye hediyesi olarak Liberty Adası\'na dikilmiştir. 93 metre yüksekliğiyle New York Limanı\'nı muhteşem bir görünümle karşılayan heykel, göç ve özgürlüğün evrensel sembolü haline gelmiştir. Tacının içine çıkılarak New York ve New Jersey\'nin panoramik manzarası izlenebilir.', latitude: 40.6892, longitude: -74.0445, address: 'Liberty Island, New York', rating: 4.7, reviewCount: 87000, visitDuration: '2-3 saat', entranceFee: '24 $', openingHours: '09:00-17:00', tags: ['ikonik', 'özgürlük', 'heykel', 'ada', 'ABD'], isFeatured: true, imageUrl: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=800&h=500&fit=crop' },
      { cityName: 'New York', name: 'Central Park', slug: 'central-park-new-york', category: 'Doğa', shortDescription: 'Manhattan\'ın kalbindeki 341 hektarlık yeşil cennet.', description: 'Central Park, 1858\'de Olmsted ve Vaux tarafından tasarlanan ve New York\'un kalbindeki 341 hektarlık büyük kenthalkı parkıdır. Göller, çimenlikler, dört mevsim çiçeçek bahçeleri, tiyatro alanları, buz pisti ve jogging parkurlarıyla New Yorklular ve turistlerin en sevdiği nefes alma noktasıdır. Yılda 42 milyon ziyaretçiyle dünyanın en çok ziyaret edilen kentsel parkıdır.', latitude: 40.7851, longitude: -73.9683, address: '59th - 110th St, Manhattan, New York', rating: 4.8, reviewCount: 95000, visitDuration: '1-4 saat', entranceFee: 'Ücretsiz', openingHours: '06:00-01:00', tags: ['park', 'doğa', 'yürüyüş', 'bisiklet', 'Manhattan'], isFeatured: true, imageUrl: 'https://images.unsplash.com/photo-1568515387631-8b650bbcdb90?w=800&h=500&fit=crop' },
      { cityName: 'New York', name: 'Times Square', slug: 'times-square-new-york', category: 'Kültür', shortDescription: 'Neon ışıkların ve kalabalığın hiç durmayan kalbi.', description: 'Times Square, Broadway ile 7. Cadde\'nin kesişiminde yer alan ve neon tabelaları, büyük ekranları, tiyatroları, restoranları ve alışveriş merkezleriyle gece gündüz canlılığını koruyan New York\'un en ikonik noktasıdır. Her yıl Yeni Yıl gecesi gerçekleşen top düşürme töreni tüm dünya tarafından izlenen bir televizyon olayına dönüşmüştür.', latitude: 40.7580, longitude: -73.9855, address: 'Times Square, New York', rating: 4.5, reviewCount: 74000, visitDuration: '1-2 saat', entranceFee: 'Ücretsiz', openingHours: '24 saat', tags: ['ikonik', 'neon', 'Broadway', 'alışveriş', 'eğlence'], isFeatured: true, imageUrl: 'https://images.unsplash.com/photo-1499092346302-2a4c19d8ff52?w=800&h=500&fit=crop' },
      { cityName: 'San Francisco', name: 'Golden Gate Köprüsü', slug: 'golden-gate-koprusu', category: 'Tarihi', shortDescription: 'Dünyanın en fotoğraflanan asma köprüsü.', description: 'Golden Gate Köprüsü, 1937\'de açılan ve 2.737 metre uzunluğuyla San Francisco Koyu\'nun girişine kurulan ikonik asma köprüdür. Turuncu-kırmızı rengi ve sis içindeki görüntüsüyle dünyanın en çok tanınan yapılarından biridir. Köprü boyunca yürüyüş ve bisiklet parkurları mevcuttur.', latitude: 37.8199, longitude: -122.4783, address: 'Golden Gate Bridge, San Francisco', rating: 4.8, reviewCount: 68000, visitDuration: '1-2 saat', entranceFee: 'Ücretsiz (yürüyüş)', openingHours: '24 saat', tags: ['köprü', 'ikonik', 'manzara', 'fotoğraf', 'San Francisco'], isFeatured: true, imageUrl: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=500&fit=crop' },
      { cityName: 'Las Vegas', name: 'Las Vegas Strip', slug: 'las-vegas-strip', category: 'Eğlence', shortDescription: 'Dünyanın eğlence merkezi, casino ve gösterilerin Mekka\'sı.', description: 'Las Vegas Strip, Las Vegas Bulvarı\'nın yaklaşık 6.7 km\'lik kesiminde yer alan dünyanın en ünlü casino ve otel kompleksleri sırasıdır. Bellagio fıskiyeleri, Eiffel Kulesi replikası (Paris Hotel), Venedik tarzı gondollar (The Venetian), Sfenks ve Piramit (Luxor) buradaki en çarpıcı yapılardır. Her gece binlerce ışıklı gösteriye sahne olur.', latitude: 36.1147, longitude: -115.1728, address: 'Las Vegas Blvd, Las Vegas', rating: 4.6, reviewCount: 59000, visitDuration: 'Tam gün / gece', entranceFee: 'Ücretsiz (gezinti)', openingHours: '24 saat', tags: ['casino', 'eğlence', 'gece hayatı', 'gösteriler', 'Las Vegas'], isFeatured: true, imageUrl: 'https://images.unsplash.com/photo-1581351721010-8cf859cb14a4?w=800&h=500&fit=crop' },
      { cityName: 'Chicago', name: 'Millennium Park ve The Bean', slug: 'millennium-park-chicago', category: 'Kültür', shortDescription: 'Gökyüzünü yansıtan kromluklu Cloud Gate heykeli.', description: 'Chicago\'nun Millennium Parkı\'ndaki Cloud Gate (The Bean) heykeli, Hindistanlı-Britanyalı sanatçı Anish Kapoor tarafından tasarlanan ve çevrenizdeki şehri aynalı yüzeyde çarpıcı biçimde yansıtan simgesel eserdir. Park aynı zamanda Crown Fountain, Jay Pritzker Pavilion açık hava konser alanı ve Lurie Bahçesi\'ni de barındırır.', latitude: 41.8827, longitude: -87.6233, address: '201 E Randolph St, Chicago', rating: 4.7, reviewCount: 48000, visitDuration: '1-2 saat', entranceFee: 'Ücretsiz', openingHours: '06:00-23:00', tags: ['heykel', 'park', 'mimari', 'fotoğraf', 'Chicago'], isFeatured: false, imageUrl: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&h=500&fit=crop' },
    ],
  },

  // ──────────────────── İNGİLTERE ────────────────────
  {
    country: { name: 'İngiltere', code: 'GB', flag: '🇬🇧', continent: 'Avrupa', capital: 'Londra', population: 67220000 },
    cities: [
      { name: 'Londra', code: 1, region: 'İngiltere', population: 9002488, latitude: 51.5074, longitude: -0.1278, description: 'Dünyanın en kozmopolit şehirlerinden biri, Big Ben ve Buckingham Sarayı ile ünlü.' },
      { name: 'Edinburgh', code: 2, region: 'İskoçya', population: 524930, latitude: 55.9533, longitude: -3.1883, description: 'İskoçya\'nın başkenti, kalesi ve festival kültürüyle ünlü.' },
      { name: 'Manchester', code: 3, region: 'Kuzey İngiltere', population: 553230, latitude: 53.4808, longitude: -2.2426, description: 'Futbol kültürü, müzik sahnesi ve sanayi mirası ile ünlü.' },
    ],
    places: [
      { cityName: 'Londra', name: 'Big Ben ve Parlamento Binası', slug: 'big-ben-parlamento-londra', category: 'Tarihi', shortDescription: 'İngiltere\'nin en ikonik saati ve neo-gotik Parlamento binası.', description: 'Big Ben, resmi adıyla Elizabeth Kulesi, Westminster Sarayı\'nın (İngiltere Parlamentosu) kuzey ucunda yer alan ve dünyanın en tanınan saatli kulesidir. 1859\'da tamamlanan kule, gotik canlandırma mimarisinin şaheserdir. Thames Nehri kıyısındaki bu kompleks, Westminster Köprüsü ile birlikte Londra\'nın en çok fotoğraflanan manzarasını oluşturur.', latitude: 51.5007, longitude: -0.1246, address: 'Westminster, London', rating: 4.7, reviewCount: 82000, visitDuration: '30-60 dk', entranceFee: 'Ücretsiz (dış)', openingHours: '24 saat', tags: ['ikonik', 'saat', 'parlamento', 'Thames', 'gotik'], isFeatured: true, imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=500&fit=crop' },
      { cityName: 'Londra', name: 'British Museum', slug: 'british-museum-londra', category: 'Müze', shortDescription: 'Dünyanın en büyük ve en kapsamlı insanlık tarihi koleksiyonu.', description: 'British Museum, 1753\'te kurulan ve 8 milyondan fazla eser barındıran dünyanın en büyük müzelerinden biridir. Mısır mumyaları ve Rosetta Taşı, Yunan Elgin mermerleri, Asur kabartmaları ve Japonya\'dan Viking eserlerine kadar insan uygarlığının 2 milyon yıllık tarihini kapsar. Yılda 6 milyonu aşkın ziyaretçi ağırlar.', latitude: 51.5194, longitude: -0.1270, address: 'Great Russell St, London', rating: 4.8, reviewCount: 73000, visitDuration: '2-4 saat', entranceFee: 'Ücretsiz', openingHours: '10:00-17:00', tags: ['müze', 'Rosetta', 'Mısır', 'tarih', 'Yunan'], isFeatured: true, imageUrl: 'https://images.unsplash.com/photo-1564399579883-451a5d44ec08?w=800&h=500&fit=crop' },
      { cityName: 'Londra', name: 'Tower of London', slug: 'tower-of-london', category: 'Tarihi', shortDescription: '1.000 yıllık tarihi ile Kraliyet Hazinesi\'nin ve Ravens\'ların yuvası.', description: 'Tower of London, 1066\'da William the Conqueror tarafından inşa edilmiş ve yüzyıllar boyunca kraliyet sarayı, hazine, zindanı ve idam yeri olarak hizmet vermiş UNESCO korumasındaki ortaçağ kalesidir. İçinde sergilenen Kraliyet Mücevherleri ve dramatik tarihi ziyaretçileri büyüler. Kule\'nin efsanevi karanlık geçmişini anlatan yeoman gardiyanlar (Beefeaters) turları oldukça popülerdir.', latitude: 51.5081, longitude: -0.0759, address: 'Tower Hill, London', rating: 4.6, reviewCount: 58000, visitDuration: '2-3 saat', entranceFee: '29 £', openingHours: '09:00-17:30', tags: ['UNESCO', 'kale', 'ortaçağ', 'mücevher', 'tarihi'], isFeatured: true, imageUrl: 'https://images.unsplash.com/photo-1529655683826-aba9b3e77383?w=800&h=500&fit=crop' },
      { cityName: 'Edinburgh', name: 'Edinburgh Şatosu', slug: 'edinburgh-satosu', category: 'Tarihi', shortDescription: 'Şehre hakim kayalık üzerindeki İskoç kraliyet kalesi.', description: 'Edinburgh Şatosu, Castle Rock adlı volkanik kayalığın tepesinde yükselen ve yazılı tarihinin 12. yüzyıla dayandığı İskoçya\'nın en önemli tarihi yapısıdır. İskoçya Tacını, Kılıcını ve Asasını barındıran şato, St. Margaret Şapeli (12. yüzyıl), Savaş Anıtı ve Mons Meg topuyla ziyaretçileri büyüler. Her yıl Ağustos\'ta düzenlenen Edinburgh Military Tattoo gösterisi burada gerçekleştirilir.', latitude: 55.9486, longitude: -3.1999, address: 'Castlehill, Edinburgh', rating: 4.8, reviewCount: 43000, visitDuration: '2-3 saat', entranceFee: '19 £', openingHours: '09:30-17:00', tags: ['şato', 'İskoçya', 'ortaçağ', 'kraliyet', 'kaya'], isFeatured: true, imageUrl: 'https://images.unsplash.com/photo-1583468982228-19f19164aee2?w=800&h=500&fit=crop' },
    ],
  },

  // ──────────────────── YUNANİSTAN ────────────────────
  {
    country: { name: 'Yunanistan', code: 'GR', flag: '🇬🇷', continent: 'Avrupa', capital: 'Atina', population: 10718565 },
    cities: [
      { name: 'Atina', code: 1, region: 'Attika', population: 3154000, latitude: 37.9838, longitude: 23.7275, description: 'Batı medeniyetinin beşiği, Akropolis ve antik kalıntılarıyla tarih kokan başkent.' },
      { name: 'Selanik', code: 2, region: 'Orta Makedonya', population: 1104460, latitude: 40.6401, longitude: 22.9444, description: 'Kuzey Yunanistan\'ın kültür merkezi, Bizans kiliseleri ve canlı sosyal yaşamıyla ünlü.' },
      { name: 'Santorini', code: 3, region: 'Güney Ege', population: 15480, latitude: 36.3932, longitude: 25.4615, description: 'Mavi kubbeli kiliseleri, caldera manzarası ve gün batımıyla dünyanın en romantik adası.' },
      { name: 'Rodos', code: 4, region: 'Güney Ege', population: 115490, latitude: 36.4341, longitude: 28.2176, description: 'Ortaçağ şehriyle UNESCO korumasındaki ada, antik dünyanın yedi harikasından birinin yuvası.' },
    ],
    places: [
      { cityName: 'Atina', name: 'Akropolis ve Parthenon', slug: 'akropolis-parthenon-atina', category: 'Tarihi', shortDescription: 'Batı medeniyetinin en büyük sembolü, antik Yunan\'ın tacı.', description: 'Atina Akropolisi, MÖ 5. yüzyılda altın çağında inşa edilmiş ve bugün hâlâ dünya mimarlık ve kültür mirasının en önemli simgesi kabul edilen tapınak kompleksidir. Dışarıdan görünen Parthenon, Athena\'ya adanmış Dorya düzenindeki tapınaktır. UNESCO Dünya Mirası listesindedir ve her yıl milyonlarca ziyaretçi çeker.', latitude: 37.9715, longitude: 23.7267, address: 'Akropolis, Atina', rating: 4.9, reviewCount: 89000, visitDuration: '2-3 saat', entranceFee: '20 €', openingHours: '08:00-20:00', tags: ['UNESCO', 'Parthenon', 'antik Yunan', 'Atina', 'tapınak'], isFeatured: true, imageUrl: 'https://images.unsplash.com/photo-1555993539-1732b0258235?w=800&h=500&fit=crop' },
      { cityName: 'Atina', name: 'Ulusal Arkeoloji Müzesi', slug: 'ulusal-arkeoloji-muzesi-atina', category: 'Müze', shortDescription: 'Dünyanın en büyük antik Yunan eserler koleksiyonu.', description: 'Yunanistan Ulusal Arkeoloji Müzesi, Yunanistan\'ın tüm bölgelerinden gelen 11.000\'den fazla eseriyle dünyanın en kapsamlı antik Yunan arkeoloji koleksiyonunu barındırır. Miken altınları, Antikythera mekanizması, Cyclad eserleri ve bronz heykellerle tüm arkeoloji tarihinin Yunan bölümü adeta canlanmaktadır.', latitude: 37.9892, longitude: 23.7320, address: '44 Patission St, Atina', rating: 4.7, reviewCount: 38000, visitDuration: '2-3 saat', entranceFee: '12 €', openingHours: '08:00-20:00 (Salı 13:00\'dan)', tags: ['müze', 'antik Yunan', 'arkeoloji', 'Miken', 'heykel'], isFeatured: false, imageUrl: 'https://images.unsplash.com/photo-1603204077779-bed963ea7d0e?w=800&h=500&fit=crop' },
      { cityName: 'Santorini', name: 'Oia Köyü Gün Batımı', slug: 'oia-koyu-gun-batimi-santorini', category: 'Doğa', shortDescription: 'Dünyanın en ünlü gün batımı manzarası.', description: 'Santorini\'nin kuzeyinde yer alan küçük Oia köyü, caldera\'ya bakan dik kayalıklar üzerine oyulmuş mavi kubbeli beyaz evleri ve dünyanın en muhteşem gün batımı manzaralarından biriyle ünlüdür. Her akşam köy, fotoğrafçılar ve romantiklerin uğrak yerine döner. Dar taş sokaklarda dolaşmak, şarap içmek ve Ege manzarasını izlemek başlıca aktivitelerdir.', latitude: 36.4618, longitude: 25.3753, address: 'Oia, Santorini', rating: 4.9, reviewCount: 62000, visitDuration: '2-4 saat', entranceFee: 'Ücretsiz', openingHours: '24 saat', tags: ['gün batımı', 'manzara', 'romantik', 'köy', 'caldera'], isFeatured: true, imageUrl: 'https://images.unsplash.com/photo-1469796466635-455ede028aca?w=800&h=500&fit=crop' },
      { cityName: 'Rodos', name: 'Rodos Ortaçağ Şehri', slug: 'rodos-ortacag-sehri', category: 'Tarihi', shortDescription: 'Avrupa\'nın en iyi korunmuş Ortaçağ surlu şehri.', description: 'Rodos\'un tarihi şehir merkezi, UNESCO Dünya Mirası listesindeki ve Avrupa\'nın en iyi korunmuş Ortaçağ surlu şehirlerinden biridir. Şövalyelerin Yolu, şövalyelerin sarayı (Palace of the Grand Master), Hamam ve mozaik döşeli sokakları ile Ortaçağ\'a adım atıyormuş hissi verir. 14 yüzyıllık şehrin duvarları tam 4 km uzunluğundadır.', latitude: 36.4451, longitude: 28.2244, address: 'Old Town, Rodos', rating: 4.7, reviewCount: 31000, visitDuration: '2-3 saat', entranceFee: 'Ücretsiz', openingHours: '24 saat', tags: ['UNESCO', 'ortaçağ', 'şövalye', 'surlar', 'tarihi'], isFeatured: true, imageUrl: 'https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?w=800&h=500&fit=crop' },
    ],
  },

  // ──────────────────── PORTEKİZ ────────────────────
  {
    country: { name: 'Portekiz', code: 'PT', flag: '🇵🇹', continent: 'Avrupa', capital: 'Lizbon', population: 10330774 },
    cities: [
      { name: 'Lizbon', code: 1, region: 'Lizbon Bölgesi', population: 2870000, latitude: 38.7223, longitude: -9.1393, description: 'Yedi tepesi, sarı tramvayları ve Fado müziğiyle büyüleyen Atlantik başkenti.' },
      { name: 'Porto', code: 2, region: 'Kuzey Portekiz', population: 1737800, latitude: 41.1579, longitude: -8.6291, description: 'Port şarapları, azulejo çinileri ve köprüleriyle ünlü romantik nehir şehri.' },
      { name: 'Sintra', code: 3, region: 'Lizbon Bölgesi', population: 388980, latitude: 38.7979, longitude: -9.3881, description: 'Renkli sarayları ve UNESCO korumasıyla Portekiz\'in peri masalı şehri.' },
    ],
    places: [
      { cityName: 'Lizbon', name: 'Belém Kulesi', slug: 'belem-kulesi-lizbon', category: 'Tarihi', shortDescription: 'Keşifler Çağı\'nın simgesi, Manuelino tarzı kule.', description: 'Belém Kulesi, 1516\'da deniz kenarında inşa edilmiş Portekiz Manuelino tarzının şaheserlerinden biridir. Portekiz\'in keşif yolculukları için başlangıç ve dönüş noktası olan kule, Lizbon\'un en tanınan simgesidir. Tagus Nehri\'nin ağzındaki konumuyla Keşifler Anıtı ile birlikte ziyaret edilmesi önerilir.', latitude: 38.6916, longitude: -9.2160, address: 'Av. Brasília, Lizbon', rating: 4.6, reviewCount: 44000, visitDuration: '1-2 saat', entranceFee: '6 €', openingHours: '10:00-17:30 (Pazartesi kapalı)', tags: ['Manuelino', 'kule', 'kıyı', 'tarihi', 'Keşifler Çağı'], isFeatured: true, imageUrl: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&h=500&fit=crop' },
      { cityName: 'Lizbon', name: 'Alfama Mahallesi ve São Jorge Kalesi', slug: 'alfama-sao-jorge-lizbon', category: 'Tarihi', shortDescription: 'Fado\'nun anavatanı, dar sokaklı tarihi Moor mahallesi.', description: 'Alfama, Lizbon\'un Kuzey Afrika\'dan gelen Moors tarafından oluşturulmuş en eski mahallesidir. Dar sokaklarda renkli azulejo çinili ev cepheleri, tezgahlar ve Fado barlları varlığını sürdürmektedir. Tepe üzerindeki São Jorge Kalesi\'nden Lizbon ve Tagus Nehri\'nin tüm panoraması izlenir. Bu bölgede yaşayan Fado müziği UNESCO Somut Olmayan Mirası listesindedir.', latitude: 38.7139, longitude: -9.1334, address: 'Alfama, Lizbon', rating: 4.7, reviewCount: 37000, visitDuration: '2-3 saat', entranceFee: 'Ücretsiz (kale: 10 €)', openingHours: '24 saat', tags: ['Fado', 'Alfama', 'Moor', 'kale', 'manzara'], isFeatured: true, imageUrl: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&h=500&fit=crop' },
      { cityName: 'Porto', name: 'Dom Luís I Köprüsü ve Ribeira', slug: 'dom-luis-koprusu-porto', category: 'Tarihi', shortDescription: 'Douro Nehri üzerindeki çift katlı çelik köprü ve tarihi rıhtım.', description: 'Porto\'nun sembolü Dom Luís I Köprüsü, Gustav Eiffel\'in öğrencisi Théophile Seyrig tarafından 1886\'da inşa edilmiş çift katlı metal köprüdür. Alt katta araçlar ve tramvay, üst katta metro ve yayalar geçer. Köprünün altındaki Ribeira Rıhtımı, renkli binaları, kafeler ve Douro manzarasıyla UNESCO korumasında olup Porto\'nun en canlı noktasıdır.', latitude: 41.1407, longitude: -8.6097, address: 'Ribeira, Porto', rating: 4.8, reviewCount: 41000, visitDuration: '1-2 saat', entranceFee: 'Ücretsiz', openingHours: '24 saat', tags: ['köprü', 'Douro', 'rıhtım', 'tarihi', 'manzara'], isFeatured: true, imageUrl: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&h=500&fit=crop' },
      { cityName: 'Sintra', name: 'Pena Sarayı', slug: 'pena-sarayi-sintra', category: 'Tarihi', shortDescription: 'Granit tepede yükselen peri masalı rengarenk saray.', description: 'Pena Sarayı, 19. yüzyılda Portekiz Romantizmi\'nin zirvesinde inşa edilmiş ve kırmızı-sarı-turuncu renkleriyle tepede adeta havada asılı duran büyülü bir saraydır. Sintra\'nın dağlık orman parkı içinde yer alan bu UNESCO korumasındaki saray; gotik, Manueline, Moor ve Rönesans mimarisini benzersiz bir biçimde harmanlayan eşsiz bir yapıdır.', latitude: 38.7877, longitude: -9.3906, address: 'Estrada da Pena, Sintra', rating: 4.8, reviewCount: 51000, visitDuration: '2-3 saat', entranceFee: '14 €', openingHours: '09:30-18:30', tags: ['UNESCO', 'saray', 'romantizm', 'renkli', 'dağ'], isFeatured: true, imageUrl: 'https://images.unsplash.com/photo-1582462801823-0fcd03cf3b7b?w=800&h=500&fit=crop' },
    ],
  },

  // ──────────────────── HİNDİSTAN ────────────────────
  {
    country: { name: 'Hindistan', code: 'IN', flag: '🇮🇳', continent: 'Asya', capital: 'Yeni Delhi', population: 1380004385 },
    cities: [
      { name: 'Agra', code: 1, region: 'Uttar Pradesh', population: 1585705, latitude: 27.1767, longitude: 78.0081, description: 'Taj Mahal\'a ev sahipliği yapan, Moğol mirasının kalbi.' },
      { name: 'Mumbai', code: 2, region: 'Maharashtra', population: 20667656, latitude: 19.0760, longitude: 72.8777, description: 'Hindistan\'ın ekonomi başkenti, Bollywood ve sömürge dönemi mimarisiyle ünlü.' },
      { name: 'Yeni Delhi', code: 3, region: 'Delhi', population: 32941000, latitude: 28.6139, longitude: 77.2090, description: 'Hindistan\'ın başkenti, Kırmızı Kale ve muhteşem camilerle tarihi bir metropol.' },
      { name: 'Jaipur', code: 4, region: 'Rajasthan', population: 3073350, latitude: 26.9124, longitude: 75.7873, description: 'Pembe şehir, Rüzgar Sarayı ve Amber Kalesi ile Rajput mirasının merkezi.' },
    ],
    places: [
      { cityName: 'Agra', name: 'Taj Mahal', slug: 'taj-mahal-agra', category: 'Tarihi', shortDescription: 'Aşkın ebedi simgesi, dünyanın en güzel yapısı.', description: 'Taj Mahal, Moğol İmparatoru Şah Cihan tarafından 1643\'te sevgili eşi Mümtaz Mahal\'ın anısına inşa ettirdiği beyaz mermer mausoleumdır. Dünyanın yedi yeni harikasından biri olan Taj Mahal; simetrik bahçeleri, minare dörtlüsü ve merkezi kubbesiyle İslam ve Hint mimarisinin doruk noktasını temsil eder. UNESCO Dünya Mirası listesindedir.', latitude: 27.1751, longitude: 78.0421, address: 'Dharmapuri, Agra', rating: 4.9, reviewCount: 112000, visitDuration: '2-3 saat', entranceFee: '1.100 INR', openingHours: '06:00-18:30 (Cuma kapalı)', tags: ['UNESCO', 'Moğol', 'mausoleum', 'mermer', 'aşk'], isFeatured: true, imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&h=500&fit=crop' },
      { cityName: 'Jaipur', name: 'Hawa Mahal (Rüzgar Sarayı)', slug: 'hawa-mahal-jaipur', category: 'Tarihi', shortDescription: '953 pencereli eşsiz petek cepheli saray.', description: 'Hawa Mahal (Rüzgar Sarayı), 1799\'da Maharaja Sawai Pratap Singh tarafından 953 küçük penceresiyle yaptırılmış ve soylu kadınların perdelik arkasından sokak hayatını izleyebildiği beş katlı pembe taş saraydır. Sarayın petek kovanı yapısını çağrıştıran cephesi, Jaipur\'un en ikonik görüntüsüdür.', latitude: 26.9239, longitude: 75.8267, address: 'Hawa Mahal Rd, Jaipur', rating: 4.7, reviewCount: 47000, visitDuration: '1-2 saat', entranceFee: '200 INR', openingHours: '09:00-17:00', tags: ['saray', 'Rajput', 'pembe', 'mimari', 'pencere'], isFeatured: true, imageUrl: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&h=500&fit=crop' },
      { cityName: 'Yeni Delhi', name: 'Kırmızı Kale', slug: 'kirmizi-kale-delhi', category: 'Tarihi', shortDescription: 'Moğol İmparatorluğu\'nun debdebeli kırmızı taş kalesi.', description: 'Kırmızı Kale (Lal Qila), Moğol İmparatoru Şah Cihan tarafından 1648\'de Yeni Delhi\'ye yönetim merkezini taşıyınca yaptırdığı anıtsal bir saray kalesidir. Kırmızı kumtaşından yapılmış surları ve içindeki saraylar, camiler ve bahçeleriyle UNESCO Dünya Mirası listesindedir. Her yıl 15 Ağustos Bağımsızlık Günü\'nde Başbakan burada konuşma yapar.', latitude: 28.6562, longitude: 77.2410, address: 'Netaji Subhash Marg, Delhi', rating: 4.5, reviewCount: 54000, visitDuration: '1-2 saat', entranceFee: '600 INR', openingHours: '09:30-16:30 (Pazartesi kapalı)', tags: ['UNESCO', 'Moğol', 'kale', 'tarihi', 'bağımsızlık'], isFeatured: true, imageUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&h=500&fit=crop' },
    ],
  },

  // ──────────────────── ÇİN ────────────────────
  {
    country: { name: 'Çin', code: 'CN', flag: '🇨🇳', continent: 'Asya', capital: 'Pekin', population: 1411778724 },
    cities: [
      { name: 'Pekin', code: 1, region: 'Kuzey Çin', population: 21893095, latitude: 39.9042, longitude: 116.4074, description: 'Çin\'in başkenti, Yasak Şehir ve Tiananmen Meydanı ile 3.000 yıllık tarihin kalbi.' },
      { name: 'Şanghay', code: 2, region: 'Doğu Çin', population: 24870895, latitude: 31.2304, longitude: 121.4737, description: 'Asya\'nın finans merkezi, Bund rıhtımı ve futuristik gökdelenleriyle modern Çin\'in sembolü.' },
      { name: 'Şian', code: 3, region: 'Kuzeybatı Çin', population: 12952000, latitude: 34.3416, longitude: 108.9398, description: 'İpek Yolu\'nun başlangıç şehri, Terrakota Ordusu\'nun yuvası.' },
    ],
    places: [
      { cityName: 'Pekin', name: 'Çin Seddi', slug: 'cin-seddi-pekin', category: 'Tarihi', shortDescription: 'Dünyanın en büyük insan yapımı yapısı, 21.000 km uzunluğunda.', description: 'Çin Seddi, MÖ 7. yüzyıldan itibaren inşa edilmeye başlanan ve toplam uzunluğu 21.196 km\'yi bulan dünya tarihinin en büyük savunma yapısıdır. Pekin yakınındaki Mutianyu ve Badaling bölümleri en popüler ziyaret noktalarıdır. UNESCO Dünya Mirası listesindedir ve dünyanın yedi yeni harikasından biri olarak kabul edilmektedir.', latitude: 40.4319, longitude: 116.5704, address: 'Huairou District, Pekin', rating: 4.8, reviewCount: 98000, visitDuration: '3-5 saat', entranceFee: '45 CNY', openingHours: '07:30-17:00', tags: ['UNESCO', 'Çin Seddi', 'tarihi', 'savunma', 'dünya harikası'], isFeatured: true, imageUrl: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&h=500&fit=crop' },
      { cityName: 'Pekin', name: 'Yasak Şehir (Gu Gong)', slug: 'yasak-sehir-pekin', category: 'Tarihi', shortDescription: 'Dünyanın en büyük saray kompleksi, 600 yıllık Çin imparatorluğunun merkezi.', description: 'Yasak Şehir (Gugong), 1406-1420 yılları arasında inşa edilmiş ve 24 Çin imparatoruna ev sahipliği yapmış devasa bir saray kompleksidir. 180 hektarlık alan üzerinde 980 bina ve 8.704 odayla dünyanın en büyük saray yapısıdır. UNESCO Dünya Mirası listesindedir. Ming ve Qing hanedanı eserlerini barındıran Ulusal Saray Müzesi de burada yer almaktadır.', latitude: 39.9163, longitude: 116.3972, address: 'Jingshan Front St, Dongcheng, Pekin', rating: 4.8, reviewCount: 105000, visitDuration: '3-5 saat', entranceFee: '60 CNY', openingHours: '08:30-17:00 (Pazartesi kapalı)', tags: ['UNESCO', 'saray', 'imparatorluk', 'Ming', 'Çin tarihi'], isFeatured: true, imageUrl: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=800&h=500&fit=crop' },
      { cityName: 'Şian', name: 'Terrakota Ordusu', slug: 'terrakota-ordusu-sian', category: 'Müze', shortDescription: '8.000 gerçek boyutlu pişmiş toprak savaşçıdan oluşan eşsiz mezar kompleksi.', description: 'Terrakota Ordusu, MÖ 210 yılında hayatını kaybeden Çin\'in ilk imparatoru Qin Shi Huang\'ın mezarını korumak için yapılmış 8.000\'i aşkın gerçek boyutlu pişmiş toprak savaşçı, savaş arabası ve at heykelinden oluşan inanılmaz arkeolojik keşiftir. 1974\'te köylüler tarafından kazaen keşfedilen bu eserler, UNESCO korumasındadır.', latitude: 34.3845, longitude: 109.2786, address: 'Lintong District, Şian', rating: 4.9, reviewCount: 76000, visitDuration: '2-4 saat', entranceFee: '120 CNY', openingHours: '08:30-17:00', tags: ['UNESCO', 'imparator', 'heykel', 'arkeoloji', 'antik Çin'], isFeatured: true, imageUrl: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&h=500&fit=crop' },
    ],
  },

  // ──────────────────── TAYLAND ────────────────────
  {
    country: { name: 'Tayland', code: 'TH', flag: '🇹🇭', continent: 'Asya', capital: 'Bangkok', population: 70000000 },
    cities: [
      { name: 'Bangkok', code: 1, region: 'Orta Tayland', population: 10720000, latitude: 13.7563, longitude: 100.5018, description: 'Altın tapınakları, canlı sokak pazarları ve modern gökdelenleriyle eşsiz kontrast.' },
      { name: 'Chiang Mai', code: 2, region: 'Kuzey Tayland', population: 1039000, latitude: 18.7883, longitude: 98.9853, description: 'Kuzey Tayland\'ın kültür başkenti, 300\'den fazla tapınağı ve yemyeşil dağlarıyla.' },
      { name: 'Phuket', code: 3, region: 'Güney Tayland', population: 416582, latitude: 7.9519, longitude: 98.3381, description: 'Andaman Denizi\'nin incisi, turkuaz suları ve canlı gece hayatıyla Tayland\'ın en popüler adası.' },
    ],
    places: [
      { cityName: 'Bangkok', name: 'Büyük Saray ve Wat Phra Kaew', slug: 'buyuk-saray-wat-phra-kaew-bangkok', category: 'Tarihi', shortDescription: 'Tayland\'ın en kutsal tapınağı ve etkileyici kraliyet sarayı kompleksi.', description: 'Büyük Saray, 1782\'de inşa edilmiş ve Siamese/Tayland mimarisinin en muhteşem örneği olarak kabul edilen komplekstir. İçindeki Wat Phra Kaew (Zümrüt Buda Tapınağı), son derece kutsal kabul edilen Tayland\'ın ulusal simgesi olan 45 cm\'lik zümrüt renkli Buda heykelini barındırır. Her yıl 8 milyonu aşkın ziyaretçiyle Bangkok\'un en çok ziyaret edilen atraksyonudur.', latitude: 13.7500, longitude: 100.4913, address: 'Na Phra Lan Rd, Bangkok', rating: 4.8, reviewCount: 74000, visitDuration: '2-3 saat', entranceFee: '500 THB', openingHours: '08:30-15:30', tags: ['tapınak', 'saray', 'Budist', 'Tayland', 'altın'], isFeatured: true, imageUrl: 'https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=800&h=500&fit=crop' },
      { cityName: 'Chiang Mai', name: 'Doi Suthep Tapınağı', slug: 'doi-suthep-tapinagi-chiangmai', category: 'Tarihi', shortDescription: 'Dağ zirvesinde kutsal Tayland tapınağı, şehrin koruyucusu.', description: 'Wat Phra That Doi Suthep, Chiang Mai\'nin sembolü olan ve 1383\'te kurulmuş bir tapınaktır. 1676 basamaklı ejder süslemeli merdiven (ya da teleferik) ile ulaşılan 1.676 metre yükseklikteki tapınak, bilge rahipler tarafından mukaddes kabul edilen relikler içerir. Buradan Chiang Mai Ovası\'nın tüm panoraması izlenir.', latitude: 18.8047, longitude: 98.9217, address: 'Doi Suthep, Chiang Mai', rating: 4.7, reviewCount: 42000, visitDuration: '1-2 saat', entranceFee: '50 THB', openingHours: '06:00-20:00', tags: ['tapınak', 'dağ', 'Budist', 'manzara', 'kutsal'], isFeatured: true, imageUrl: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&h=500&fit=crop' },
      { cityName: 'Phuket', name: 'Phi Phi Adaları', slug: 'phi-phi-adalari-phuket', category: 'Plaj', shortDescription: 'Turkuaz cennet, sarp kayalıklar ve kristal berrak sular.', description: 'Phi Phi Adaları, Phuket\'in güneydoğusunda yer alan ve eşsiz güzelliğiyle ünlü küçük adalar topluluğudur. Phi Phi Don ve Phi Phi Leh olmak üzere iki ana adadan oluşan takımada; derin turkuaz koylar, sarp kireçtaşı kayalıklar ve lush ormanlarla dünyanın en güzel dalış ve şnorkeling noktalarından biri olarak bilinir. Tekne turlarıyla ulaşılır.', latitude: 7.7407, longitude: 98.7784, address: 'Phi Phi Islands, Krabi', rating: 4.8, reviewCount: 58000, visitDuration: '1-3 gün', entranceFee: '400 THB (milli park)', openingHours: 'Gündüz (tekne saatlerine göre)', tags: ['ada', 'plaj', 'dalış', 'koy', 'tropikal'], isFeatured: true, imageUrl: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&h=500&fit=crop' },
    ],
  },

  // ──────────────────── MEKSİKA ────────────────────
  {
    country: { name: 'Meksika', code: 'MX', flag: '🇲🇽', continent: 'Kuzey Amerika', capital: 'Meksiko City', population: 127575529 },
    cities: [
      { name: 'Meksiko City', code: 1, region: 'Orta Meksika', population: 21671908, latitude: 19.4326, longitude: -99.1332, description: 'Aztek geleneği ve sömürge mirasını modern yaşamla harmanlayan Latin Amerika\'nın en büyük şehri.' },
      { name: 'Cancun', code: 2, region: 'Yucatan Yarımadası', population: 888797, latitude: 21.1619, longitude: -86.8515, description: 'Karayip\'in turkuaz sularında Meksika\'nın en popüler tatil beldesi.' },
      { name: 'Mérida', code: 3, region: 'Yucatan', population: 1052456, latitude: 20.9674, longitude: -89.6230, description: 'Beyaz şehir, Maya kültürünün ve Yucatan mutfağının kalbi.' },
    ],
    places: [
      { cityName: 'Meksiko City', name: 'Teotihuacan Piramitleri', slug: 'teotihuacan-piramitleri', category: 'Tarihi', shortDescription: 'Antik Amerikan\'ın en büyük şehri, Güneş ve Ay piramitleri.', description: 'Teotihuacan, MÖ 100-MS 650 yılları arasında inşa edilmiş ve döneminde dünyanın en büyük şehirlerinden biri olan antik bir Mezoamerikan kentidir. Güneş Piramidi (yükseklik: 65 m) ve Ay Piramidi, Ölüler Bulvarı boyunca dizilmiş anıtsal yapılarla birlikte UNESCO Dünya Mirası listesindedir.', latitude: 19.6925, longitude: -98.8438, address: 'San Juan Teotihuacán, Meksiko City', rating: 4.8, reviewCount: 63000, visitDuration: '3-5 saat', entranceFee: '80 MXN', openingHours: '09:00-17:00', tags: ['UNESCO', 'piramit', 'Aztek', 'antik', 'Mezoamerika'], isFeatured: true, imageUrl: 'https://images.unsplash.com/photo-1518638150340-f706e86654de?w=800&h=500&fit=crop' },
      { cityName: 'Cancun', name: 'Chichen Itza', slug: 'chichen-itza-cancun', category: 'Tarihi', shortDescription: 'Maya medeniyetinin devasa tapınak şehri, dünyanın yedi yeni harikasından biri.', description: 'Chichén Itzá, MS 900\'de zirveye ulaşan Maya medeniyetinin başkentiydi. El Castillo (Kukulcan Piramidi), 3.000 kişilik oyun alanı, İskeletin Meydanı ve çeşitli tapınaklardan oluşan kompleks UNESCO Dünya Mirası ve dünyanın Yedi Yeni Harikası\'ndan biri olarak kabul edilmektedir. Her bahar ekinoksunda piramit üzerindeki gölge yılan etkisi binlerce kişiyi toplar.', latitude: 20.6843, longitude: -88.5678, address: 'Yucatán, Meksika', rating: 4.9, reviewCount: 71000, visitDuration: '3-4 saat', entranceFee: '571 MXN', openingHours: '08:00-17:00', tags: ['UNESCO', 'Maya', 'piramit', 'dünya harikası', 'arkeoloji'], isFeatured: true, imageUrl: 'https://images.unsplash.com/photo-1518638150340-f706e86654de?w=800&h=500&fit=crop' },
      { cityName: 'Cancun', name: 'Tulum Arkeolojik Alanı', slug: 'tulum-arkeolojik-alani', category: 'Tarihi', shortDescription: 'Karayip sahilindeki kayalıklar üstünde Maya tapınak kalıntıları.', description: 'Tulum, Karayip denizine bakan sarp kayalıklar üzerine kurulmuş ve 1200\'lü yıllarda inşa edilmiş Maya liman şehridir. El Castillo tapınağından Karayip\'in turkuaz sularına uzanan manzara, Amerikalarda bu tür eşsiz bir sahne olmaktan çıkmamaktadır. Tapınak alanının hemen aşağısındaki plaj ziyaretçilerin uğrak yeridir.', latitude: 20.2130, longitude: -87.4288, address: 'Tulum, Quintana Roo', rating: 4.6, reviewCount: 44000, visitDuration: '1-2 saat', entranceFee: '85 MXN', openingHours: '08:00-17:00', tags: ['Maya', 'kıyı', 'plaj', 'tarihi', 'Karayip'], isFeatured: true, imageUrl: 'https://images.unsplash.com/photo-1518638150340-f706e86654de?w=800&h=500&fit=crop' },
    ],
  },

  // ──────────────────── KANADA ────────────────────
  {
    country: { name: 'Kanada', code: 'CA', flag: '🇨🇦', continent: 'Kuzey Amerika', capital: 'Ottawa', population: 38250000 },
    cities: [
      { name: 'Toronto', code: 1, region: 'Ontario', population: 2731571, latitude: 43.6534, longitude: -79.3832, description: 'Kanada\'nın en büyük şehri, CN Kulesi ve çok kültürlü yaşamıyla ünlü.' },
      { name: 'Vancouver', code: 2, region: 'Britanya Kolombiyası', population: 675218, latitude: 49.2827, longitude: -123.1207, description: 'Dağlar ve okyanusun buluştuğu, dünyanın yaşanabilir şehirlerden biri.' },
      { name: 'Quebec City', code: 3, region: 'Quebec', population: 531902, latitude: 46.8139, longitude: -71.2080, description: 'Kuzey Amerika\'nın tek surlu şehri, Fransız mirasıyla UNESCO korumasında.' },
    ],
    places: [
      { cityName: 'Toronto', name: 'CN Kulesi', slug: 'cn-kulesi-toronto', category: 'Tarihi', shortDescription: '553 metreyle dünyanın en yüksek bina sıralamasında tarihi kule.', description: 'CN Kulesi, 1976\'da tamamlanan ve birleşik bir TV yayın kulesi ile gözlem kulesi olarak işlev gören 553 metre yüksekliğinde Toronto\'nun simgesidir. Saydam zeminli gözlem güvertesinden (EdgeWalk deneyimiyle kule dışında da yürünebilir) Ontario Gölü ve Toronto\'nun panoramik manzarası izlenir.', latitude: 43.6426, longitude: -79.3871, address: '290 Bremner Blvd, Toronto', rating: 4.6, reviewCount: 51000, visitDuration: '1-2 saat', entranceFee: '43 CAD', openingHours: '09:00-21:00', tags: ['kule', 'manzara', 'Toronto', 'ikonik', 'Canada'], isFeatured: true, imageUrl: 'https://images.unsplash.com/photo-1517090186835-e348b621c9ca?w=800&h=500&fit=crop' },
      { cityName: 'Vancouver', name: 'Banff Milli Parkı', slug: 'banff-milli-parki-vancouver', category: 'Doğa', shortDescription: 'Türkuaz dağ gölleri ve Kayalık Dağlar\'ın nefes kesen güzelliği.', description: 'Banff Milli Parkı, 1885\'te kurulan Kanada\'nın ilk milli parkıdır. Kayalık Dağlar\'ın içinde buzullar, turkuaz göller (Lake Louise ve Moraine Lake), yaban hayatı ve kayak merkezleriyle dünyanın en güzel doğa destinasyonlarından biridir. UNESCO Dünya Mirası listesindedir.', latitude: 51.4968, longitude: -115.9281, address: 'Banff, Alberta', rating: 4.9, reviewCount: 67000, visitDuration: '2-7 gün', entranceFee: '21 CAD/gün', openingHours: '24 saat', tags: ['UNESCO', 'milli park', 'dağ', 'göl', 'kayak'], isFeatured: true, imageUrl: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&h=500&fit=crop' },
      { cityName: 'Quebec City', name: 'Vieux-Québec Tarihi Merkezi', slug: 'vieux-quebec-tarihi-merkez', category: 'Tarihi', shortDescription: 'Kuzey Amerika\'nın tek Orta Çağ surlu şehri, Fransız mirası.', description: 'Vieux-Québec (Eski Québec), Kuzey Amerika\'nın hâlâ ayakta olan tek surlu şehridir ve UNESCO Dünya Mirası listesindedir. 1608\'de Fransızlar tarafından kurulan şehrin dar taş sokaklı tarihi merkezi, 17-18. yüzyıldan kalma binaları, Château Frontenac oteli ve güçlendirilmiş surlarıyla Fransız Orta Çağ şehrine benzersiz benzerliği ile ün kazanmıştır.', latitude: 46.8123, longitude: -71.2145, address: 'Vieux-Québec, Quebec City', rating: 4.8, reviewCount: 38000, visitDuration: '2-3 saat', entranceFee: 'Ücretsiz', openingHours: '24 saat', tags: ['UNESCO', 'surlar', 'Fransız', 'tarihi', 'Orta Çağ'], isFeatured: true, imageUrl: 'https://images.unsplash.com/photo-1519832979-6fa011b87667?w=800&h=500&fit=crop' },
    ],
  },

  // ──────────────────── HOLLANDA ────────────────────
  {
    country: { name: 'Hollanda', code: 'NL', flag: '🇳🇱', continent: 'Avrupa', capital: 'Amsterdam', population: 17590000 },
    cities: [
      { name: 'Amsterdam', code: 1, region: 'Kuzey Hollanda', population: 921402, latitude: 52.3676, longitude: 4.9041, description: 'Kanalları, lale bahçeleri ve özgürlükçü yaşam tarzıyla dünyaca ünlü.' },
      { name: 'Lahey', code: 2, region: 'Güney Hollanda', population: 551289, latitude: 52.0705, longitude: 4.3007, description: 'Uluslararası adalet mahkemelerinin şehri, Vermeer ve Hollanda sanatının merkezi.' },
    ],
    places: [
      { cityName: 'Amsterdam', name: 'Anne Frank Evi', slug: 'anne-frank-evi-amsterdam', category: 'Müze', shortDescription: 'Anne Frank\'in günlüğünü yazdığı tarihi ev-müze.', description: 'Anne Frank Evi, 2. Dünya Savaşı sırasında Yahudi kız Anne Frank ve ailesinin 2 yılı aşkın süre gizlendiği kanala bakan tarihi bir Amsterdam evinda kurulmuş müzedir. 1947\'de basılan Anne\'nin günlüğünün aslı burada sergilenmekte, tarihsel belgeler ve izlenim odasıyla savaş dönemini canlandırmaktadır.', latitude: 52.3752, longitude: 4.8840, address: 'Prinsengracht 263-267, Amsterdam', rating: 4.8, reviewCount: 54000, visitDuration: '1-2 saat', entranceFee: '14 €', openingHours: '09:00-22:00', tags: ['müze', 'Holokost', 'tarihi', 'günlük', 'savaş'], isFeatured: true, imageUrl: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800&h=500&fit=crop' },
      { cityName: 'Amsterdam', name: 'Rijksmuseum', slug: 'rijksmuseum-amsterdam', category: 'Müze', shortDescription: 'Rembrandt ve Vermeer başyapıtlarının evi.', description: 'Rijksmuseum, 700 yıllık Hollanda ve Flaman sanatı ile tarihini barındıran Hollanda\'nın milli müzesidir. Rembrandt\'ın Gece Devriyesi, Vermeer\'in Süt Döken Kız ve Frans Hals\'ın eserleri müzenin en değerli koleksiyonları arasındadır. 1885\'te açılan neo-gotik-Rönesans bina da başlı başına müze mirasıdır.', latitude: 52.3600, longitude: 4.8852, address: 'Museumstraat 1, Amsterdam', rating: 4.8, reviewCount: 61000, visitDuration: '2-4 saat', entranceFee: '22,50 €', openingHours: '09:00-17:00', tags: ['müze', 'Rembrandt', 'Vermeer', 'Hollandalı', 'sanat'], isFeatured: true, imageUrl: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800&h=500&fit=crop' },
      { cityName: 'Amsterdam', name: 'Amsterdam Kanalları', slug: 'amsterdam-kanallari', category: 'Doğa', shortDescription: 'UNESCO korumasındaki 17. yy. kanal halkası, tekne turları.', description: 'Amsterdam\'ın 165 km\'lik kanal ağı ve kanallara bakan 1550 anıtsal yapısıyla oluşan tarihi kanal kuşağı, UNESCO Dünya Mirası listesindedir. Tekne turları, kanalların her iki yakasındaki dar çiçekli ev cephelerini, köprüleri ve houseboat\'ları (ev tekne) yakından görme imkanı sunar. Prinsengracht, Herengracht ve Keizersgracht ana kanallardır.', latitude: 52.3740, longitude: 4.8897, address: 'Amsterdam Kanallara, Amsterdam', rating: 4.7, reviewCount: 49000, visitDuration: '1-2 saat', entranceFee: '15 € (tekne)', openingHours: '10:00-22:00', tags: ['UNESCO', 'kanal', 'tekne', 'ev', 'Amsterdam'], isFeatured: true, imageUrl: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800&h=500&fit=crop' },
    ],
  },

  // ──────────────────── FARELİ ────────────────────
  {
    country: { name: 'Fas', code: 'MA', flag: '🇲🇦', continent: 'Afrika', capital: 'Rabat', population: 37457971 },
    cities: [
      { name: 'Marakeş', code: 1, region: 'Marakeş-Safi', population: 1070838, latitude: 31.6295, longitude: -7.9811, description: 'Pembe şehir, Djemaa el-Fna meydanı ve canlı medina yaşamıyla büyüleyen.' },
      { name: 'Fes', code: 2, region: 'Fes-Meknes', population: 1112072, latitude: 34.0339, longitude: -5.0003, description: 'Dünyanın en büyük yaya şehri, el-değmemiş ortaçağ medina UNESCO koruma altında.' },
      { name: 'Şefşaven', code: 3, region: 'Tanger-Tetouan', population: 45855, latitude: 35.1688, longitude: -5.2636, description: 'Her köşesi mavi boyalı dağ şehri, Fas\'ın mavi incisi.' },
    ],
    places: [
      { cityName: 'Marakeş', name: 'Djemaa el-Fna Meydanı', slug: 'djemaa-el-fna-marakes', category: 'Kültür', shortDescription: 'UNESCO korumalı, yılan oynatıcılar ve hikaye anlatıcılarının rengarenk meydanı.', description: 'Djemaa el-Fna, Marakeş\'in merkezinde yer alan ve UNESCO Somut Olmayan Kültürel Miras listesindeki eşsiz açık hava performans alanıdır. Gündüz meyve ve baharat satıcılarıyla dolup taşarken, gün batımıyla birlikte yılan oynatıcılar, akrobatlar, hikaye anlatıcıları, müzisyenler ve yüzlerce yemek tezgahıyla canlanan dev bir açık hava gösteri alanına dönüşür.', latitude: 31.6258, longitude: -7.9892, address: 'Djemaa el-Fna, Marakeş', rating: 4.7, reviewCount: 62000, visitDuration: '2-4 saat', entranceFee: 'Ücretsiz', openingHours: '24 saat', tags: ['UNESCO', 'meydan', 'kültür', 'gösteri', 'sokak'], isFeatured: true, imageUrl: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&h=500&fit=crop' },
      { cityName: 'Fes', name: 'Fes el-Bali Medina', slug: 'fes-el-bali-medina', category: 'Tarihi', shortDescription: 'Dünyanın en büyük motorlu araç trafiğine kapalı ortaçağ şehri.', description: 'Fes el-Bali, 9. yüzyılda kurulan ve motorlu taşıt giremeyen 9.400\'den fazla sokağıyla dünyanın en büyük yaya medina alanıdır. UNESCO Dünya Mirası listesindeki bu antik şehirde El Karouine (dünyanın en eski üniversitesi, 859), Bou Inania Medresesi ve el işi dericilik (tabakhaneler, özellikle Chouara Tabakhane) başlıca çekicilikleridir.', latitude: 34.0650, longitude: -4.9764, address: 'Fes el-Bali, Fes', rating: 4.8, reviewCount: 44000, visitDuration: '3-5 saat', entranceFee: 'Ücretsiz', openingHours: '24 saat', tags: ['UNESCO', 'medina', 'ortaçağ', 'tabakhane', 'tarihi'], isFeatured: true, imageUrl: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&h=500&fit=crop' },
      { cityName: 'Şefşaven', name: 'Şefşaven Mavi Medina', slug: 'sefsaven-mavi-medina', category: 'Kültür', shortDescription: 'Her köşesinin farklı tonlarda mavi boyandığı büyülü dağ kasabası.', description: 'Şefşaven\'in neden tamamen mavi boyandığına dair tartışmalar sürmektedir; bir efsaneye göre Yahudi mülteciler, iyi şansı getirdiğine inandıkları bu rengi kullanmıştır. Her neyse ki sonuç; mavi boyalı duvarlar, mor çiçekler ve arka plandaki dağlar arasında Instagram\'ın en çok paylaşılan Fas fotoğraflarını yaratan büyüleyici bir kasabadır.', latitude: 35.1688, longitude: -5.2636, address: 'Medina, Şefşaven', rating: 4.7, reviewCount: 39000, visitDuration: '2-4 saat', entranceFee: 'Ücretsiz', openingHours: '24 saat', tags: ['mavi', 'medina', 'fotoğraf', 'dağ', 'renkli'], isFeatured: true, imageUrl: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&h=500&fit=crop' },
    ],
  },

  // ──────────────────── PERU ────────────────────
  {
    country: { name: 'Peru', code: 'PE', flag: '🇵🇪', continent: 'Güney Amerika', capital: 'Lima', population: 32972854 },
    cities: [
      { name: 'Cusco', code: 1, region: 'Cusco Bölgesi', population: 428450, latitude: -13.5319, longitude: -71.9675, description: 'İnka İmparatorluğu\'nun başkenti, 3.400 metre rakımda tarihi taş şehir.' },
      { name: 'Lima', code: 2, region: 'Lima Bölgesi', population: 10750000, latitude: -12.0464, longitude: -77.0428, description: 'Peru\'nun başkenti, sömürge dönemi tarihi ve dünyaca ünlü mutfağıyla.' },
      { name: 'Puno', code: 3, region: 'Puno Bölgesi', population: 141000, latitude: -15.8402, longitude: -70.0219, description: 'Titicaca Gölü kıyısında dünyanın en yüksek gezilebilir gölüne açılan kapı.' },
    ],
    places: [
      { cityName: 'Cusco', name: 'Machu Picchu', slug: 'machu-picchu-cusco', category: 'Tarihi', shortDescription: 'Bulutların üstündeki kayıp İnka şehri, dünyanın yeni yedi harikasından biri.', description: 'Machu Picchu, 2.430 metre yükseklikte And Dağları\'nın bulutların arasındaki bir tepesine inşa edilmiş ve 15. yüzyılda yalnızca 100 yıl kullanıldıktan sonra terk edilerek yüzyıllarca keşfedilmemiş muazzam bir İnka şehridir. 1911\'de Hiram Bingham tarafından keşfedilen kompleks, UNESCO Dünya Mirası ve Yeni Yedi Harika\'nın en ikonik temsilcisidir.', latitude: -13.1631, longitude: -72.5450, address: 'Machu Picchu, Cusco Bölgesi', rating: 4.9, reviewCount: 93000, visitDuration: 'Tam gün', entranceFee: '152 $', openingHours: '06:00-17:30', tags: ['UNESCO', 'İnka', 'dağ', 'harika', 'arkeoloji'], isFeatured: true, imageUrl: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800&h=500&fit=crop' },
      { cityName: 'Puno', name: 'Titicaca Gölü Yüzen Adaları', slug: 'titicaca-golu-yuzen-adalari', category: 'Kültür', shortDescription: 'Dünyanın en yüksek göl üzerindeki sazdan yapma yüzen adalar.', description: 'Uros kabilesinin oluşturduğu ve hâlâ yaşadığı yüzen saz adaları, 3.800 metre rakımdaki Titicaca Gölü üzerinde yer alır. Totora sazından (bir kamış türü) yapılmış bu benzersiz yapay adaların bazıları yüzlerce yıl önce İnka\'ların zulmünden kaçmak için oluşturulmuştur. Kabilenin günümüzde sürdürdüğü otantik yaşam biçimi ve el sanatları görülmeye değerdir.', latitude: -15.8170, longitude: -69.9779, address: 'Titicaca Gölü, Puno', rating: 4.7, reviewCount: 32000, visitDuration: 'Tam gün', entranceFee: '35 $', openingHours: 'Gündüz (tekne turları)', tags: ['yüzen ada', 'göl', 'kültür', 'yerli', 'eşsiz'], isFeatured: true, imageUrl: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800&h=500&fit=crop' },
    ],
  },

  // ──────────────────── GÜNEY AFRİKA ────────────────────
  {
    country: { name: 'Güney Afrika', code: 'ZA', flag: '🇿🇦', continent: 'Afrika', capital: 'Pretoria', population: 59308690 },
    cities: [
      { name: 'Cape Town', code: 1, region: 'Batı Kap', population: 4617560, latitude: -33.9249, longitude: 18.4241, description: 'Masa Dağı, iki okyanusun buluşması ve şarap rotalarıyla Güney Afrika\'nın cennet köşesi.' },
      { name: 'Johannesburg', code: 2, region: 'Gauteng', population: 9608568, latitude: -26.2041, longitude: 28.0473, description: 'Afrika\'nın altın şehri, Apartheid müzesi ve ekonominin kalbi.' },
    ],
    places: [
      { cityName: 'Cape Town', name: 'Masa Dağı Milli Parkı', slug: 'masa-dagi-cape-town', category: 'Doğa', shortDescription: 'Düz zirvesiyle Cape Town\'ın tahtında oturan efsanevi dağ.', description: 'Masa Dağı (Table Mountain), Cape Town\'ın üzerine kurulua ve 1.086 metre düz zirvesiyle şehre bakan ikonik bir dağdır; aynı zamanda dünyanın en eski dağlarından biri olarak kabul edilir. Teleferik ile ya da yürüyüş rotalarıyla zirveden şehir, Atlantik ve Hint okyanuslarının birleştiği noktanın muhteşem manzarası izlenir.', latitude: -33.9628, longitude: 18.4098, address: 'Table Mountain, Cape Town', rating: 4.9, reviewCount: 67000, visitDuration: '2-4 saat', entranceFee: '380 ZAR (teleferik)', openingHours: '08:00-18:00', tags: ['dağ', 'teleferik', 'manzara', 'doğa', 'ikonik'], isFeatured: true, imageUrl: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&h=500&fit=crop' },
      { cityName: 'Cape Town', name: 'Ümit Burnu', slug: 'umit-burnu-cape-town', category: 'Doğa', shortDescription: 'Afrika\'nın en güney ucundaki dramatik sahil kıyısı.', description: 'Ümit Burnu, Afrika kıtasının güneybatı ucunda yer alan ve Atlas ile Hint okyanuslarının buluşmasına yakın, fırtınalı denizleri ve sarp kayalıklarıyla ünlü dramatik bir burundur. Ümit Burnu Milli Parkı içindeki bu noktada Afrika penguen kolonileri, babunlar ve fok ailelerine erişim mümkündür.', latitude: -34.3568, longitude: 18.4731, address: 'Cape Point, Cape Town', rating: 4.8, reviewCount: 48000, visitDuration: '2-4 saat', entranceFee: '353 ZAR (park girişi)', openingHours: '07:00-17:00', tags: ['okyanus', 'doğa', 'milli park', 'penguenler', 'kıyı'], isFeatured: true, imageUrl: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&h=500&fit=crop' },
      { cityName: 'Johannesburg', name: 'Apartheid Müzesi', slug: 'apartheid-muzesi-johannesburg', category: 'Müze', shortDescription: 'Güney Afrika\'nın ırkçılık politikasını ve özgürlük mücadelesini anlatan çarpıcı müze.', description: 'Apartheid Müzesi, Güney Afrika\'nın 1948-1994 yılları arasındaki ırkçılık politikasını ve Nelson Mandela liderliğindeki özgürlük mücadelesini tüm boyutlarıyla aktaran, dünya genelinde en etkili tarih müzelerinden biri olarak kabul edilmektedir. Fotoğraflar, filmler, eserler ve kişisel tanıklıklar ziyaretçilere derin ve duygusal bir deneyim sunar.', latitude: -26.2348, longitude: 27.9757, address: 'Northern Pkwy, Johannesburg', rating: 4.8, reviewCount: 29000, visitDuration: '2-3 saat', entranceFee: '150 ZAR', openingHours: '09:00-17:00 (Pazartesi kapalı)', tags: ['müze', 'Apartheid', 'Mandela', 'tarih', 'özgürlük'], isFeatured: true, imageUrl: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&h=500&fit=crop' },
    ],
  },

  // ──────────────────── BAE ────────────────────
  {
    country: { name: 'Birleşik Arap Emirlikleri', code: 'AE', flag: '🇦🇪', continent: 'Asya', capital: 'Abu Dabi', population: 9890402 },
    cities: [
      { name: 'Dubai', code: 1, region: 'Dubai', population: 3331420, latitude: 25.2048, longitude: 55.2708, description: 'Çölde yükselen gökdelenleri, alışveriş merkezleri ve lüksle dünyanın en hızlı büyüyen şehri.' },
      { name: 'Abu Dabi', code: 2, region: 'Abu Dabi', population: 1480792, latitude: 24.4539, longitude: 54.3773, description: 'BAE\'nin başkenti, Şeyh Zayed Camii ve kültürel zenginlikleriyle.' },
    ],
    places: [
      { cityName: 'Dubai', name: 'Burj Khalifa', slug: 'burj-khalifa-dubai', category: 'Tarihi', shortDescription: '828 metreyle dünyanın en uzun binası.', description: 'Burj Khalifa, 828 metre yüksekliğiyle 2010\'dan bu yana dünyanın en yüksek binası unvanını taşımaktadır. 160 katlı bu dev gökdelen; lüks daireler, oteller, restoranlar ve 124. ile 148. kattaki gözlem güvertelerini barındırır. Gözlem güvertesinden Dubai\'nin tüm panoraması, çöl ve körfez manzarası izlenebilir.', latitude: 25.1972, longitude: 55.2744, address: '1 Sheikh Mohammed bin Rashid Blvd, Dubai', rating: 4.7, reviewCount: 78000, visitDuration: '1-2 saat', entranceFee: '149 AED', openingHours: '10:00-23:00', tags: ['gökdelen', 'dünyanın en yükseği', 'manzara', 'Dubai', 'mimari'], isFeatured: true, imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=500&fit=crop' },
      { cityName: 'Dubai', name: 'Dubai Alışveriş Merkezi ve Çeşme Gösterisi', slug: 'dubai-mall-cesmen-gosterisi', category: 'Eğlence', shortDescription: 'Dünyanın en büyük alışveriş merkezi ve Burj Gölü\'ndeki görkemli çeşme gösterisi.', description: 'Dubai Mall, 502.000 m² net kiralanabilir alanıyla dünyanın en büyük alışveriş merkezi kompleksidir. 1.200\'den fazla dükkan, devlerin içinde yüzdüğü akvaryum (Dubai Aquarium) ve buz patinaj pistinin yanı sıra Burj Khalifa\'nın dibindeki göl üzerinde her gece 82-150 metre yüksekliğe fırlayan dünyanın en büyük çeşme gösterisi yaşanmaktadır.', latitude: 25.1985, longitude: 55.2796, address: 'Financial Center Rd, Dubai', rating: 4.7, reviewCount: 61000, visitDuration: '3-6 saat', entranceFee: 'Ücretsiz', openingHours: '10:00-01:00', tags: ['alışveriş', 'çeşme', 'akvaryum', 'eğlence', 'Dubai'], isFeatured: true, imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=500&fit=crop' },
      { cityName: 'Abu Dabi', name: 'Şeyh Zayed Büyük Camii', slug: 'seyh-zayed-buyuk-camii-abu-dabi', category: 'Tarihi', shortDescription: 'Dünyanın en büyük camilerinden biri, 82 kubbesi ve 1.000 sütunuyla.', description: 'Şeyh Zayed Büyük Camii, 1996-2007 arasında inşa edilen ve BAE\'nin kurucusu Şeyh Zayed\'in ölümünden sonra kendisine adanan camiidir. 22.000 kişi kapasitesiyle İslam dünyasının en büyük camilerinden biridir; 82 kubbe, 1.000 sütun, 17.000 m2\'lik dünyanın en büyük el dokuması halısı ve dünyanın en büyük avizesi burada bulunmaktadır. Mermer işçiliği ve geometrik süslemeler nefes kesmektedir.', latitude: 24.4128, longitude: 54.4751, address: 'Sheikh Rashid Bin Saeed St, Abu Dabi', rating: 4.9, reviewCount: 72000, visitDuration: '1-2 saat', entranceFee: 'Ücretsiz', openingHours: '09:00-22:00 (Cuma 16:30\'dan)', tags: ['cami', 'İslam', 'mimari', 'mermer', 'BAE'], isFeatured: true, imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=500&fit=crop' },
    ],
  },

  // ──────────────────── RUSYA ────────────────────
  {
    country: { name: 'Rusya', code: 'RU', flag: '🇷🇺', continent: 'Avrupa', capital: 'Moskova', population: 146171015 },
    cities: [
      { name: 'Moskova', code: 1, region: 'Merkez Rusya', population: 12506468, latitude: 55.7558, longitude: 37.6173, description: 'Kremlin, Kızıl Meydan ve soğan kubbeli katedral ile Rusya\'nın siyasi ve kültürel kalbi.' },
      { name: 'St. Petersburg', code: 2, region: 'Kuzeybatı Rusya', population: 5351935, latitude: 59.9311, longitude: 30.3609, description: 'Peter Büyük\'ün inşa ettirdiği Kuzey\'in Venediği, Hermitage Müzesi ile dünyanın sanat başkentlerinden biri.' },
    ],
    places: [
      { cityName: 'Moskova', name: 'Kızıl Meydan ve Aziz Vasil Katedrali', slug: 'kizil-meydan-aziz-vasil-moskova', category: 'Tarihi', shortDescription: 'Rusya\'nın kalbi, soğan kubbeli katedraliyle ikonik meydan.', description: 'Kızıl Meydan (Krasnaya Ploshchad), Moskova\'nın ve tüm Rusya\'nın simgesidir. Kremlin sur duvarlarına komşu meydanda yer alan Aziz Vasil Katedrali (1561), renkli soğan kubbeleriyle dünyanın en çok tanınan yapılarından biridir. Meydan aynı zamanda Devlet Tarihi Müzesi, GUM mağazası ve Lenin Mozolesi\'ne de ev sahipliği yapmaktadır.', latitude: 55.7539, longitude: 37.6208, address: 'Kızıl Meydan, Moskova', rating: 4.8, reviewCount: 74000, visitDuration: '1-2 saat', entranceFee: 'Ücretsiz', openingHours: '24 saat', tags: ['ikonik', 'katedral', 'Kremlin', 'Rusya', 'tarihi'], isFeatured: true, imageUrl: 'https://images.unsplash.com/photo-1513326738677-b964603b136d?w=800&h=500&fit=crop' },
      { cityName: 'St. Petersburg', name: 'Hermitage Müzesi', slug: 'hermitage-muzesi-st-petersburg', category: 'Müze', shortDescription: 'Dünyanın en büyük sanat müzelerinden biri, 3 milyon eser.', description: 'Hermitage Müzesi, 1764\'te Çariçe II. Katarina\'nın sanat koleksiyonuyla kurulan ve bugün 3 milyondan fazla eseri barındıran dünyanın en büyük ve en eski müzelerinden biridir. Kış Sarayı\'nın (eski çar sarayı) içindeki salolardan geçen koleksiyon; da Vinci, Rembrandt, Michelangelo, Matisse ve Picasso başta olmak üzere insanlık sanat tarihinin tüm dönemlerini kapsar.', latitude: 59.9399, longitude: 30.3146, address: 'Palace Square 2, St. Petersburg', rating: 4.9, reviewCount: 81000, visitDuration: '3-6 saat', entranceFee: '500 RUB', openingHours: '10:30-18:00 (Pazartesi kapalı)', tags: ['müze', 'sanat', 'Kış Sarayı', 'Rembrandt', 'Rusya'], isFeatured: true, imageUrl: 'https://images.unsplash.com/photo-1513326738677-b964603b136d?w=800&h=500&fit=crop' },
    ],
  },

];

// ════════════════════════════════════════════════════════════
//  SEEDER
// ════════════════════════════════════════════════════════════

const seedAll = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB Bağlandı\n');

    let totalCountries = 0;
    let totalCities = 0;
    let totalPlaces = 0;
    let skippedPlaces = 0;

    for (const entry of newData) {
      // ── 1. Ülkeyi Ekle (yoksa) ──────────────────────────────
      let countryDoc = await Country.findOne({ code: entry.country.code });
      if (!countryDoc) {
        countryDoc = await Country.create(entry.country);
        console.log(`🌍 Ülke eklendi: ${entry.country.flag} ${entry.country.name}`);
        totalCountries++;
      } else {
        console.log(`⏭️  Ülke zaten mevcut: ${entry.country.flag} ${entry.country.name}`);
      }

      // ── 2. Şehirleri Ekle (yoksa) ───────────────────────────
      const cityMap = {};
      for (const [idx, city] of entry.cities.entries()) {
        let cityDoc = await City.findOne({ name: city.name, country: countryDoc._id });
        if (!cityDoc) {
          cityDoc = await City.create({ ...city, country: countryDoc._id });
          console.log(`   🏙️  ${city.name} eklendi`);
          totalCities++;
        }
        cityMap[city.name] = cityDoc._id;
      }

      // ── 3. Yerleri Ekle (slug yoksa) ────────────────────────
      for (const place of entry.places) {
        const existing = await Place.findOne({ slug: place.slug });
        if (existing) {
          console.log(`   ⏭️  Zaten var: ${place.name}`);
          skippedPlaces++;
          continue;
        }
        const cityId = cityMap[place.cityName];
        if (!cityId) {
          console.warn(`   ⚠️  Şehir bulunamadı: ${place.cityName}`);
          skippedPlaces++;
          continue;
        }
        const { cityName, ...fields } = place;
        await Place.create({ ...fields, city: cityId, country: countryDoc._id });
        console.log(`   ✅ ${place.cityName} - ${place.name}`);
        totalPlaces++;
      }

      console.log('');
    }

    console.log('══════════════════════════════════════════════');
    console.log(`✨ Tamamlandı!`);
    console.log(`   🌍 Ülke:  ${totalCountries} yeni eklendi`);
    console.log(`   🏙️  Şehir: ${totalCities} yeni eklendi`);
    console.log(`   📍 Yer:   ${totalPlaces} yeni eklendi (${skippedPlaces} atlandı)`);
    console.log('══════════════════════════════════════════════');

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('Seed hatası:', err.message);
    process.exit(1);
  }
};

seedAll();
