const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Customer' },
    name: { type: String, required: true },
    address: { type: String, required: true } 
}, { timestamps: true });

module.exports = mongoose.model('Location', locationSchema);