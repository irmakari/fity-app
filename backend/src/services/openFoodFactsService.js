const axios = require('axios');

const BASE_URL = 'https://world.openfoodfacts.org/api/v2/search';

/**
 * Normalize an Open Food Facts product into our Food schema shape.
 * @param {object} product - Raw OFF product object
 * @returns {object|null}
 */
const normalizeProduct = (product) => {
  const n = product.nutriments || {};
  const calories =
    n['energy-kcal_100g'] || n['energy-kcal'] || n['energy_100g'] / 4.187 || null;

  if (!calories || !product.product_name) return null;

  return {
    name: (product.product_name_tr || product.product_name).trim(),
    caloriesPerServing: Math.round(calories),
    proteinG: Math.round(n.proteins_100g || 0),
    carbsG: Math.round(n.carbohydrates_100g || 0),
    fatG: Math.round(n.fat_100g || 0),
    servingSize: 100,
    servingUnit: 'g',
    source: 'open_food_facts',
  };
};

/**
 * Search Open Food Facts for a food by name.
 * Returns the best matching normalized food or null.
 * @param {string} query
 * @returns {Promise<object|null>}
 */
const searchFood = async (query) => {
  try {
    const { data } = await axios.get(BASE_URL, {
      params: {
        search_terms: query,
        fields: 'product_name,product_name_tr,nutriments',
        sort_by: 'popularity_key',
        page_size: 10,
        json: 1,
      },
      timeout: 5000,
    });

    const products = data?.products || [];
    const queryLower = query.toLowerCase();

    for (const product of products) {
      const normalized = normalizeProduct(product);
      if (!normalized) continue;

      // Relevance guard: at least one query word must appear in the product name
      // This prevents OFF returning a random popular item for unknown Turkish foods
      const nameLower = normalized.name.toLowerCase();
      const queryWords = queryLower.split(/\s+/).filter((w) => w.length > 2);
      const isRelevant =
        queryWords.length === 0 ||
        queryWords.some((word) => nameLower.includes(word)) ||
        nameLower.includes(queryLower);

      if (isRelevant) return normalized;
    }

    return null;
  } catch (err) {
    // Network or timeout errors are non-fatal — fall through to AI
    console.warn('Open Food Facts search failed:', err.message);
    return null;
  }
};

module.exports = { searchFood };
