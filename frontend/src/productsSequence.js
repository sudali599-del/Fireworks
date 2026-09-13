import catalogData from './catalogData.js';

// Canonical Categories with their official Sequence order (1 to 24)
export const CANONICAL_CATEGORIES = [
  { name: 'ONE SOUND CRACKERS', sequence: 1 },
  { name: 'FLOWER POTS', sequence: 2 },
  { name: 'GROUND CHAKKAR', sequence: 3 },
  { name: 'ROCKETS', sequence: 4 },
  { name: 'TWINKLING STAR', sequence: 5 },
  { name: 'ELECTRIC CRACKERS', sequence: 6 },
  { name: 'DELUXE CRACKERS', sequence: 7 },
  { name: 'SPECIAL GARLANDS', sequence: 8 },
  { name: 'BIJILI', sequence: 9 },
  { name: 'BOMBS', sequence: 10 },
  { name: 'PENCIL FOUNTAIN', sequence: 11 },
  { name: 'SPARKLERS', sequence: 12 },
  { name: 'MULTI COLOUR FOUNTAINS', sequence: 13 },
  { name: 'PEACOCK FOUNTAIN', sequence: 14 },
  { name: 'MUSICAL ITEMS', sequence: 15 },
  { name: 'AERIAL FANCY', sequence: 16 },
  { name: 'AERIAL FANCY SHOTS', sequence: 17 },
  { name: 'AERIAL MULTI SHOTS FANCY', sequence: 18 },
  { name: 'SPECIAL FANCY FOUNTAIN', sequence: 19 },
  { name: 'SPECIAL FOUNTAINS', sequence: 20 },
  { name: 'NEW ARRIVAL FOUNTAINS', sequence: 21 },
  { name: 'CHILDRENS FANCY', sequence: 22 },
  { name: 'CAPS & SERPENT', sequence: 23 },
  { name: 'GIFT BOXES', sequence: 24 }
];

// Normalize category names to handle database spelling variants
export function normalizeCategoryName(rawName) {
  if (!rawName) return 'Uncategorized';
  const trimmed = rawName.trim().toUpperCase();

  if (trimmed === 'PENCIL') return 'PENCIL FOUNTAIN';
  if (trimmed === 'SPECIAL FANCY FOUNTAINS') return 'SPECIAL FANCY FOUNTAIN';
  if (trimmed === 'CHILDRENS SPECIAL') return 'CHILDRENS FANCY';
  if (trimmed === 'FANCY FOUNTAINS') return 'MULTI COLOUR FOUNTAINS';

  return trimmed;
}

// Map alias for matching
const SPECIFIC_NAME_ALIASES = {
  '4" SUPER DELUXE LAKSHMI': 5,
  'FLOWER POTS DLX(5 PCS)': 18,
  'LUCK (5PCS)(RED&GREEN)': 19,
  'LUNIX EXPRESS ROCKET': 28,
  '11/2’ TWINKLING STAR': 32,
  '4’ TWINKLING STAR': 33,
  'SILVER CRACKERS(1K) (SUPER-FAST)': 41,
  'RED BIJILI(50 PCS)': 45,
  'STRIPPED BIJILI(100PCS)': 46,
  'KING OF KING(10 PCS)': 49,
  '15CM 5 IN 1 SPARKLERS': 74,
  '30 CM COLOR SPARKLES(5PCS)': 76,
  '50 CM ELECTRIC SPARKERS(5 PCS)': 79,
  '31/2’’ COLOUR PIPE FANCY': 109,
  '7 SHOT(5 PCS)': 113,
  '12 SHOT': 114,
  '30 SHOT': 115,
  '60 SHOT': 116,
  '120 SHOT': 117,
  '240 SHOT': 118,
  'TRIX/GOODLY/MINIOS (3 PCS)': 119,
  'REEN/RED/GREEN/SILVER/GOLD STAR (3 PCS)': 124,
  'ROPE COLOURS(4 PCS)': 133,
  '75 CM ELECTRIC SPARKLERS': 83,
  'SHINCHAN TRI COLOUR FOUNTAIN(3 PCS)': 86,
  'SPLATOON-TRI COLOUR FOUNTAIN SUPER DULEX (5 PCS)': 88,
  'PEACOCK 5 IN 1': 91,
  'PEACOCK MEGA MULTI COLOUR': 94,
  'COLOUR SMOKE (3 PCS)': 54,
};

function cleanStringForMatch(str) {
  return (str || '')
    .toUpperCase()
    .replace(/½/g, '1/2')
    .replace(/¼/g, '1/4')
    .replace(/¾/g, '3/4')
    .replace(/[“”]/g, '"')
    .replace(/[^A-Z0-9]/g, '');
}

// Precompute catalog lookups
const catalogMap = new Map();
catalogData.forEach(item => {
  const clean = cleanStringForMatch(item.name);
  catalogMap.set(clean, item.siNo);
});

/**
 * Get authentic serial / sequence number for a product
 */
export function getProductSequenceNumber(product, fallbackIndex = 999) {
  if (typeof product.siNo === 'number' && product.siNo > 0) {
    return product.siNo;
  }
  if (typeof product.sequence === 'number' && product.sequence > 0) {
    return product.sequence;
  }

  const rawUpper = (product.name || '').trim().toUpperCase();
  if (SPECIFIC_NAME_ALIASES[rawUpper]) {
    return SPECIFIC_NAME_ALIASES[rawUpper];
  }

  const cleanName = cleanStringForMatch(product.name);
  if (catalogMap.has(cleanName)) {
    return catalogMap.get(cleanName);
  }

  // Fallback fuzzy search within catalog
  for (const [key, siNo] of catalogMap.entries()) {
    if (key.length > 5 && cleanName.length > 5 && (key.includes(cleanName) || cleanName.includes(key))) {
      return siNo;
    }
  }

  return 1000 + fallbackIndex;
}

/**
 * Align all products with their canonical sequence order within categories,
 * and sort categories strictly by their sequence numbers.
 */
export function organizeProductsBySequence(rawProducts, configuredCategories = []) {
  if (!Array.isArray(rawProducts) || rawProducts.length === 0) {
    return {
      orderedCategories: [],
      categorizedProducts: {},
      allOrderedProducts: []
    };
  }

  // Build effective categories map
  const catSequenceMap = new Map();
  CANONICAL_CATEGORIES.forEach(c => {
    catSequenceMap.set(normalizeCategoryName(c.name), c.sequence);
  });

  if (Array.isArray(configuredCategories)) {
    configuredCategories.forEach(c => {
      if (c && c.name) {
        catSequenceMap.set(normalizeCategoryName(c.name), c.sequence ?? 999);
      }
    });
  }

  // Enhance each product with its authentic sequence number and normalized category
  const enhancedProducts = rawProducts.map((p, idx) => {
    const normCategory = normalizeCategoryName(p.productType);
    const assignedSiNo = getProductSequenceNumber(p, idx + 1);
    return {
      ...p,
      productType: normCategory,
      computedSiNo: assignedSiNo
    };
  });

  // Group by category
  const groups = {};
  enhancedProducts.forEach(p => {
    const cat = p.productType;
    if (!groups[cat]) {
      groups[cat] = [];
    }
    groups[cat].push(p);
  });

  // Sort products inside each category by computedSiNo ascending
  Object.keys(groups).forEach(cat => {
    groups[cat].sort((a, b) => a.computedSiNo - b.computedSiNo);
  });

  // Sort categories by sequence number
  const uniqueCategories = Object.keys(groups);
  uniqueCategories.sort((a, b) => {
    const seqA = catSequenceMap.get(a) ?? 999;
    const seqB = catSequenceMap.get(b) ?? 999;
    if (seqA !== seqB) return seqA - seqB;
    return a.localeCompare(b);
  });

  const orderedCategorizedProducts = {};
  const allOrderedProducts = [];
  let continuousIndex = 1;

  uniqueCategories.forEach(cat => {
    orderedCategorizedProducts[cat] = groups[cat].map(item => {
      const itemWithSeq = {
        ...item,
        displayIndex: continuousIndex++
      };
      allOrderedProducts.push(itemWithSeq);
      return itemWithSeq;
    });
  });

  return {
    orderedCategories: uniqueCategories.map(name => ({
      name,
      sequence: catSequenceMap.get(name) ?? 999,
      itemCount: orderedCategorizedProducts[name]?.length || 0
    })),
    categorizedProducts: orderedCategorizedProducts,
    allOrderedProducts
  };
}
