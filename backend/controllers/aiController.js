const { GoogleGenerativeAI } = require('@google/generative-ai');
const City = require('../models/City');

// Gemini API ayarları
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'MISSING_KEY');

// @desc    Yapay zeka ile kişiselleştirilmiş rota oluştur
// @route   POST /api/ai/generate-route
// @access  Private
exports.generateRoute = async (req, res) => {
  try {
    const { destination, days, travelStyle, interests } = req.body;

    if (!destination || !days) {
      return res.status(400).json({ message: 'Lütfen gidilecek yeri ve gün sayısını belirtin.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ message: 'Sunucuda Gemini API anahtarı eksik. Lütfen .env dosyasına GEMINI_API_KEY ekleyin.' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `
    Sen profesyonel bir seyahat rehberisin. Kullanıcı ${destination} için ${days} günlük bir gezi planı istiyor.
    Seyahat tarzı: ${travelStyle || 'Dengeli'}.
    İlgi alanları: ${interests ? interests.join(', ') : 'Genel turistik yerler'}.
    
    Lütfen bu kriterlere uygun, gün gün planlanmış mantıklı ve optimize edilmiş bir rota oluştur.
    Aynı birbirine yakın yerleri aynı güne koymaya özen göster.

    ÖNEMLİ: Çıktıyı SADECE AŞAĞIDAKİ JSON FORMATINDA ver. Asla markdown (\`\`\`json ... \`\`\`) veya ekstra metin ekleme. Sadece saf JSON nesnesi döndür.

    {
      "destination": "${destination}",
      "totalDays": ${days},
      "title": "Kısa ve ilgi çekici bir rota başlığı",
      "summary": "Bu rotanın kısa bir özeti (1-2 cümle)",
      "itinerary": [
        {
          "day": 1,
          "theme": "Günün konsepti/teması (örn: Tarihi Yarımada Keşfi)",
          "activities": [
            {
              "time": "Sabah (veya Öğle, Akşam gibi yaklaşık zaman)",
              "placeName": "Gezilecek Mekanın Tam Adı",
              "description": "Mekan hakkında kısa bilgi ve neden görülmesi gerektiği (1-2 cümle)",
              "duration": "Önerilen süre (örn: 2 saat)"
            }
          ]
        }
      ]
    }
    `;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text();

    // Markdown temizliği (Eğer Gemini inatla markdown içinde JSON dönerse)
    responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

    const parsedData = JSON.parse(responseText);

    res.status(200).json(parsedData);
  } catch (error) {
    console.error('Yapay Zeka Rota Hatası:', error);
    res.status(500).json({ message: 'Rota oluşturulurken bir hata oluştu.', error: error.message });
  }
};
