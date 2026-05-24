const { getModel } = require('./geminiClient');

/**
 * Prompt template for nutritional data lookup.
 * Low temperature is set on the model level so values are consistent.
 */
const buildPrompt = (foodName) => `
Sen Türk ve uluslararası mutfak konusunda uzman bir diyetisyensin.
"${foodName}" yiyeceği için ortalama besin değerlerini döndür.

Kurallar:
- Yalnızca geçerli bir JSON objesi döndür, başka hiçbir şey yazma.
- Değerler 100 gram için olsun (servingSize: 100, servingUnit: "g").
- Yiyecek gerçek bir yiyecek değilse veya bulamazsan "notFound": true döndür.
- Kalori değerleri makul aralıkta olsun (su 0 kcal, tereyağı ~740 kcal gibi).

JSON şeması:
{
  "name": "string — yiyeceğin standart Türkçe adı",
  "caloriesPerServing": number,
  "proteinG": number,
  "carbsG": number,
  "fatG": number,
  "servingSize": 100,
  "servingUnit": "g",
  "notFound": false
}
`.trim();

/**
 * Use Gemini AI to look up nutritional data for a food item.
 * Returns a normalized food object or null if not found / API unavailable.
 * @param {string} foodName
 * @returns {Promise<object|null>}
 */
const lookupFoodNutrition = async (foodName) => {
  if (!process.env.GEMINI_API_KEY) return null;

  try {
    const model = getModel();
    const result = await model.generateContent(buildPrompt(foodName));
    const text = result.response.text();
    const data = JSON.parse(text);

    if (data.notFound) return null;

    return {
      name: data.name || foodName,
      caloriesPerServing: Math.round(data.caloriesPerServing || 0),
      proteinG: Math.round(data.proteinG || 0),
      carbsG: Math.round(data.carbsG || 0),
      fatG: Math.round(data.fatG || 0),
      servingSize: 100,
      servingUnit: 'g',
      source: 'ai',
    };
  } catch (err) {
    console.error('Gemini food lookup failed:', err.message);
    return null;
  }
};

module.exports = { lookupFoodNutrition };
