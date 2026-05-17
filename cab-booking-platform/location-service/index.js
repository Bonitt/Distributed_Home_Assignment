require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

app.get('/health', (req,res) => {
    res.json({ status: 'Location Service is healthy' });

});

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
    console.log(`Location Service running on port ${PORT}`);
});