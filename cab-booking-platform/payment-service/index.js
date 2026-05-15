require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const paymentRoutes = require('./routes/paymentRoutes');


const app = express();
app.use(express.json());
app.use(cors());
app.use('/api/payments', paymentRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Payment Service connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

app.get('/health', (req, res) => {
    res.json({ status: 'Payment Service is running' });
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
    console.log(`Payment Service running on port ${PORT}`);
});