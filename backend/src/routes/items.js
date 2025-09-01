const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const router = express.Router();
const DATA_PATH = path.join(__dirname, '../../../data/items.json');

// Async utility to read data (non-blocking)
async function readData() {
  try {
    const raw = await fs.readFile(DATA_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // File doesn't exist, return empty array
      console.log('Data file not found, returning empty array');
      return [];
    }
    if (error.name === 'SyntaxError') {
      console.error('Invalid JSON in data file:', error.message);
      throw new Error('Data file is corrupted');
    }
    throw error;
  }
}

// Async utility to write data (non-blocking)
async function writeData(data) {
  try {
    // Ensure data directory exists
    const dataDir = path.dirname(DATA_PATH);
    try {
      await fs.access(dataDir);
    } catch {
      await fs.mkdir(dataDir, { recursive: true });
    }
    
    // Write data atomically
    const tempPath = DATA_PATH + '.tmp';
    const jsonString = JSON.stringify(data, null, 2);
    
    await fs.writeFile(tempPath, jsonString, 'utf8');
    await fs.rename(tempPath, DATA_PATH);
  } catch (error) {
    console.error('Error writing data file:', error.message);
    throw error;
  }
}

// GET /api/items
router.get('/', async (req, res, next) => {
  try {
    const data = await readData();
    
    // Parse query parameters with defaults
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const q = req.query.q || '';
    const sortBy = req.query.sortBy || 'name';
    const sortOrder = req.query.sortOrder || 'asc';
    
    // Filter results
    let results = data;
    if (q) {
      const searchTerm = q.toLowerCase();
      results = results.filter(item => 
        item.name.toLowerCase().includes(searchTerm) ||
        (item.category && item.category.toLowerCase().includes(searchTerm))
      );
    }
    
    // Sort results
    results.sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      const order = sortOrder === 'asc' ? 1 : -1;
      
      if (typeof aVal === 'string') {
        return aVal.localeCompare(bVal) * order;
      }
      return (aVal - bVal) * order;
    });
    
    // Calculate pagination
    const totalItems = results.length;
    const totalPages = Math.ceil(totalItems / limit);
    const offset = (page - 1) * limit;
    const paginatedResults = results.slice(offset, offset + limit);
    
    // Return paginated response with metadata
    res.json({
      data: paginatedResults,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      },
      search: {
        query: q,
        resultsCount: results.length
      }
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/items/:id
router.get('/:id', async (req, res, next) => {
  try {
    const data = await readData();
    const item = data.find(i => i.id === parseInt(req.params.id));
    if (!item) {
      const err = new Error('Item not found');
      err.status = 404;
      throw err;
    }
    res.json(item);
  } catch (err) {
    next(err);
  }
});

// POST /api/items
router.post('/', async (req, res, next) => {
  try {
    // TODO: Validate payload (intentional omission)
    const item = req.body;
    const data = await readData();
    item.id = Date.now();
    data.push(item);
    await writeData(data);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
});

module.exports = router;