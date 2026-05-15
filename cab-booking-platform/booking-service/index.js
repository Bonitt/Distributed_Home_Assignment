require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Booking Service connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

app.get('/health', (req, res) => {
    res.json({ status: 'Booking Service is running' });

});

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
    console.log(`Booking Service running on port ${PORT}`);
});