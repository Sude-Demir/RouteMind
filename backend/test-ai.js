require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGemini() {
  try {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.log('HATA: GEMINI_API_KEY .env dosyasında bulunamadı.');
      return;
    }
    
    console.log('GEMINI_API_KEY bulundu. İlk 5 karakter:', key.substring(0, 5));
    
    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `
    Sen profesyonel bir seyahat rehberisin. Kullanıcı Roma için 1 günlük bir gezi planı istiyor.
    Seyahat tarzı: Dengeli.
    İlgi alanları: Tarih.
    
    Lütfen bu kriterlere uygun, gün gün planlanmış mantıklı ve optimize edilmiş bir rota oluştur.
    Aynı birbirine yakın yerleri aynı güne koymaya özen göster.

    ÖNEMLİ: Çıktıyı SADECE AŞAĞIDAKİ JSON FORMATINDA ver. Asla markdown (\`\`\`json ... \`\`\`) veya ekstra metin ekleme. Sadece saf JSON nesnesi döndür.

    {
      "destination": "Roma",
      "totalDays": 1,
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

    console.log('Gemini\'ye istek gönderiliyor...');
    const result = await model.generateContent(prompt);
    let responseText = result.response.text();
    console.log('Gelen Ham Cevap:\n', responseText);
    
    responseText = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
    const parsedData = JSON.parse(responseText);
    console.log('\nJSON başarıyla parse edildi! Rota Başlığı:', parsedData.title);
  } catch (error) {
    console.error('\nHATA DETAYI:');
    console.error(error.message);
  }
}

testGemini();
