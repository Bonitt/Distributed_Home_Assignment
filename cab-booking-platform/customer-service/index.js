require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Customer Service connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

app.get(('/health'), (req, res) => {
   res.json({status: 'Customer Service is running'});
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Customer Service running on port ${PORT}`);
});