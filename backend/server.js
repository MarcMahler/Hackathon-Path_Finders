const express = require('express');
const cors = require('cors');
const inventoryData = require('./data/inventory');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend server is running' });
});

// Inventory endpoints
app.get('/api/inventory', (req, res) => {
  try {
    res.json({
      success: true,
      data: inventoryData,
      count: inventoryData.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch inventory data'
    });
  }
});

// Get inventory by location
app.get('/api/inventory/location/:locationName', (req, res) => {
  try {
    const { locationName } = req.params;
    const filtered = inventoryData.filter(item => 
      item.location.toLowerCase().includes(locationName.toLowerCase())
    );
    
    res.json({
      success: true,
      data: filtered,
      count: filtered.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch location inventory'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📊 Inventory API available at http://localhost:${PORT}/api/inventory`);
});

module.exports = app;