const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const router = express.Router();

const DATA_PATH = path.join(__dirname, '../../../data/items.json');

// Strategy 1: In-Memory Cache with TTL
class StatsCache {
  constructor(ttlMs = 300000) { // 5 minutes TTL
    this.cache = null;
    this.lastUpdated = 0;
    this.ttl = ttlMs;
    this.calculating = false;
  }

  isValid() {
    return this.cache !== null && (Date.now() - this.lastUpdated) < this.ttl;
  }

  set(data) {
    this.cache = data;
    this.lastUpdated = Date.now();
    this.calculating = false;
  }

  get() {
    return this.isValid() ? this.cache : null;
  }

  invalidate() {
    console.log('Stats cache invalidated');
    this.cache = null;
    this.lastUpdated = 0;
    this.calculating = false;
  }

  isCalculating() {
    return this.calculating;
  }

  setCalculating(status) {
    this.calculating = status;
  }
}

// Initialize cache
const statsCache = new StatsCache();

// Strategy 2: File System Watching (simplified without chokidar)
let lastFileModTime = 0;

async function checkFileModified() {
  try {
    const stats = await fs.stat(DATA_PATH);
    const currentModTime = stats.mtime.getTime();

    if (lastFileModTime && currentModTime > lastFileModTime) {
      console.log('Data file modified, invalidating cache');
      statsCache.invalidate();
    }

    lastFileModTime = currentModTime;
  } catch (error) {
    // File doesn't exist or other error - ignore
  }
}

// Check file modifications every 30 seconds
setInterval(checkFileModified, 30000);

// Strategy 3: Optimized Calculation Function
async function calculateStats(items) {
  const startTime = process.hrtime.bigint();

  if (!Array.isArray(items) || items.length === 0) {
    return {
      total: 0,
      averagePrice: 0,
      categories: {},
      priceRange: { min: 0, max: 0 },
      totalValue: 0,
      calculationTime: 0
    };
  }

  let totalPrice = 0;
  let validPriceCount = 0;
  let minPrice = Infinity;
  let maxPrice = -Infinity;
  const categories = {};

  // Single pass calculation for maximum efficiency
  for (const item of items) {
    const price = Number(item.price);

    if (!isNaN(price) && price >= 0) {
      totalPrice += price;
      validPriceCount++;
      minPrice = Math.min(minPrice, price);
      maxPrice = Math.max(maxPrice, price);
    }

    if (item.category) {
      categories[item.category] = (categories[item.category] || 0) + 1;
    }
  }

  const endTime = process.hrtime.bigint();
  const calculationTime = Number(endTime - startTime) / 1000000; // Convert to ms

  const stats = {
    total: items.length,
    averagePrice: validPriceCount > 0
      ? Math.round((totalPrice / validPriceCount) * 100) / 100
      : 0,
    categories,
    priceRange: {
      min: minPrice === Infinity ? 0 : minPrice,
      max: maxPrice === -Infinity ? 0 : maxPrice
    },
    totalValue: Math.round(totalPrice * 100) / 100,
    validItems: validPriceCount,
    calculationTime: Math.round(calculationTime * 100) / 100,
    cacheTimestamp: new Date().toISOString()
  };

  console.log(`Stats calculated in ${calculationTime.toFixed(2)}ms for ${items.length} items`);
  return stats;
}

// Read data and calculate stats
async function getStatsFromFile() {
  try {
    const raw = await fs.readFile(DATA_PATH, 'utf8');
    const items = JSON.parse(raw);
    return await calculateStats(items);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('Data file not found, returning empty stats');
      return await calculateStats([]);
    }
    throw error;
  }
}

// Background refresh function
async function refreshStatsCache() {
  if (statsCache.isCalculating()) {
    return;
  }

  try {
    statsCache.setCalculating(true);
    const stats = await getStatsFromFile();
    statsCache.set(stats);
  } catch (error) {
    console.error('Error refreshing stats cache:', error.message);
    statsCache.setCalculating(false);
  }
}

// GET /api/stats - Optimized with caching
router.get('/', async (req, res, next) => {
  try {
    // Check if file was modified (Strategy 2)
    await checkFileModified();

    // Try to serve from cache first (Strategy 1)
    let stats = statsCache.get();

    if (stats) {
      // Serve from cache
      res.set('X-Cache', 'HIT');
      res.set('X-Cache-Age', Math.floor((Date.now() - statsCache.lastUpdated) / 1000));
      return res.json(stats);
    }

    // Cache miss - calculate stats (Strategy 3)
    stats = await getStatsFromFile();
    statsCache.set(stats);

    res.set('X-Cache', 'MISS');
    res.set('X-Calculation-Time', stats.calculationTime);
    res.json(stats);

  } catch (error) {
    console.error('Error in stats route:', error.message);
    next(error);
  }
});

// Cache management endpoints
router.post('/refresh', async (req, res, next) => {
  try {
    statsCache.invalidate();
    await refreshStatsCache();
    const stats = statsCache.get();

    res.json({
      message: 'Stats cache refreshed successfully',
      stats
    });
  } catch (error) {
    next(error);
  }
});

router.get('/cache-info', (req, res) => {
  res.json({
    cacheValid: statsCache.isValid(),
    lastUpdated: statsCache.lastUpdated,
    cacheAge: statsCache.lastUpdated
      ? Math.floor((Date.now() - statsCache.lastUpdated) / 1000)
      : null,
    ttl: Math.floor(statsCache.ttl / 1000),
    calculating: statsCache.isCalculating(),
    fileWatching: 'polling every 30s'
  });
});

// Warm cache on startup
process.nextTick(async () => {
  try {
    await refreshStatsCache();
    console.log('Stats cache warmed on startup');
  } catch (error) {
    console.error('Failed to warm stats cache:', error.message);
  }
});

module.exports = router;