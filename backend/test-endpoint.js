require('dotenv').config();
const jwt = require('jsonwebtoken');

async function testEndpoint() {
  try {
    const JWT_SECRET = process.env.JWT_SECRET || 'routemind_secret_key';
    const payload = { user: { id: '661234567890123456789012' } };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: 360000 });

    const response = await fetch('http://localhost:5000/api/ai/generate-route', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      },
      body: JSON.stringify({
        destination: 'Roma',
        days: 1,
        travelStyle: 'Dengeli',
        interests: ['Tarih']
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.log('HATA OLUŞTU, Status:', response.status);
      console.log('Mesaj:', data);
    } else {
      console.log('BAŞARILI CEVAP!');
      console.log(data.title);
    }
  } catch (err) {
    console.log('AĞ HATASI:', err.message);
  }
}

testEndpoint();
