const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// V1 API - Original endpoints
app.get('/api/v1/users', (req, res) => {
  res.set('Cache-Control', 'public, max-age=300');
  res.json({
    version: 'v1',
    users: [
      { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'admin' },
      { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'user' }
    ]
  });
});

app.get('/api/v1/products', (req, res) => {
  res.set('Cache-Control', 'public, max-age=3600');
  res.json({
    products: [
      { id: 101, title: 'Laptop Pro', price: 1299, stock: 15 },
      { id: 102, title: 'Wireless Mouse', price: 29, stock: 150 }
    ]
  });
});

// V2 API - Breaking changes (different field names)
app.get('/api/v2/users', (req, res) => {
  res.set('Cache-Control', 'no-cache');
  res.json({
    version: 'v2',
    data: [
      { userId: 1, fullName: 'Alice Johnson', contact: 'alice@example.com', userRole: 'admin' },
      { userId: 2, fullName: 'Bob Smith', contact: 'bob@example.com', userRole: 'user' }
    ]
  });
});

// Slow endpoint (simulates database query)
app.get('/api/v1/analytics', (req, res) => {
  setTimeout(() => {
    res.set('Cache-Control', 'no-store');
    res.json({
      pageViews: 45231,
      uniqueVisitors: 12304,
      conversionRate: 3.2,
      avgSessionDuration: 245
    });
  }, 2500); // 2.5 second delay
});

// Unreliable endpoint (30% failure rate)
app.get('/api/v1/orders', (req, res) => {
  if (Math.random() < 0.3) {
    res.status(500).json({ 
      error: 'Database connection timeout',
      code: 'DB_TIMEOUT' 
    });
  } else {
    res.set('Cache-Control', 'private, max-age=60');
    res.json({
      orders: [
        { orderId: 'ORD-001', status: 'shipped', total: 156.99 },
        { orderId: 'ORD-002', status: 'pending', total: 89.50 }
      ]
    });
  }
});

// Missing endpoint (was removed - breaking change)
// app.get('/api/v1/legacy-endpoint', ...) - intentionally commented out

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🚀 Demo API Server running on http://localhost:${PORT}`);
  console.log('='.repeat(60));
  console.log('\n📍 Available Endpoints:\n');
  console.log('  ✓ GET /api/v1/users      - User list (good caching)');
  console.log('  ✓ GET /api/v1/products   - Products (excellent caching)');
  console.log('  ✓ GET /api/v2/users      - Users V2 (BREAKING CHANGES!)');
  console.log('  ⚠️  GET /api/v1/analytics - Slow endpoint (~2.5s)');
  console.log('  ❌ GET /api/v1/orders     - Unreliable (30% fail rate)');
  console.log('  🌐 GET /                 - Demo web page');
  console.log('  ❤️  GET /health          - Health check\n');
  console.log('='.repeat(60) + '\n');
});
