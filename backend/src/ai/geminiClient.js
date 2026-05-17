const { GoogleGenerativeAI } = require('@google/generative-ai');

if (!process.env.GEMINI_API_KEY) {
  console.warn('⚠️  GEMINI_API_KEY is not set. AI food lookup will be unavailable.');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

/**
 * Returns a Gemini 1.5 Flash model instance configured for JSON output.
 * @returns {import('@google/generative-ai').GenerativeModel}
 */
const getModel = () =>
  genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.2,
    },
  });

module.exports = { getModel };
