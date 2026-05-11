require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  // Wait, there's no listModels in the JS SDK? Let's just try REST API or maybe I'll just change the model name to 'gemini-pro'.
}
listModels();
