const { getModel } = require('./geminiClient');

/**
 * Gemeni AI to suggest a healthy snack based on remaining calories and user preference.
 *
 * @param {number} remainingCalories
 * @param {string} preference (e.g. 'tatlı', 'tuzlu', 'soğuk', 'meyveli')
 * @returns {Promise<object>} JSON containing recipe and nutritional info
 */
const suggestSnack = async (remainingCalories, preference) => {
  try {
    const model = getModel();

    // If calories are too low, override behavior to just suggest something extremely light
    const isOverLimit = remainingCalories <= 50;
    const targetCalories = isOverLimit ? 50 : Math.min(remainingCalories, 400); // cap snack at 400 kcal max

    const prompt = `
      Sen profesyonel bir diyetisyen ve aşçısın.
      Kullanıcının atıştırmalık için maksimum ${targetCalories} kcal hakkı var.
      Kullanıcı "${preference || 'fark etmez'}" türünde bir atıştırmalık istiyor.
      ${
        isOverLimit
          ? 'Kullanıcı günlük kalori hedefini aşmış veya çok yaklaşmış. Ona şekersiz çay, kahve veya maden suyu gibi sıfır kalorili veya 50 kcal altı çok hafif bir şey öner.'
          : 'Buna uygun, pratik, sağlıklı ve lezzetli bir atıştırmalık öner.'
      }

      Lütfen JSON formatında aşağıdaki yapıda yanıt ver (başka metin ekleme, doğrudan JSON döndür):
      {
        "name": "Tarif Adı (Türkçe, kısa ve açıklayıcı, örn: Şekersiz Fıstık Ezmeli Elma)",
        "description": "Kısa bir motivasyon ve yapılış açıklaması (1-2 cümle)",
        "caloriesPerServing": <sayı>,
        "proteinG": <sayı>,
        "carbsG": <sayı>,
        "fatG": <sayı>,
        "servingSize": <sayı>,
        "servingUnit": "porsiyon veya gram/adet"
      }
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Temizleme (Markdown JSON blocklarını silme)
    const jsonString = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();

    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Snack AI error:', error);
    throw new Error('Yapay zeka atıştırmalık önerisi oluştururken bir hata oluştu.');
  }
};

module.exports = { suggestSnack };
