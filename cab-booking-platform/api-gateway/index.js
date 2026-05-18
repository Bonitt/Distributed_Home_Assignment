const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
app.use(cors());

app.use('/api/customers', createProxyMiddleware({ target: 'http://localhost:3001/api/customers', changeOrigin: true }));
app.use('/api/bookings', createProxyMiddleware({ target: 'http://localhost:3002/api/bookings', changeOrigin: true }));
app.use('/api/payments', createProxyMiddleware({ target: 'http://localhost:3003/api/payments', changeOrigin: true }));
app.use('/api/locations', createProxyMiddleware({ target: 'http://localhost:3004/api/locations', changeOrigin: true }));

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'API Gateway is healthy' });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`API Gateway is running on port ${PORT}`);
});