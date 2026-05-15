const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    bookingId: { type: mongoose.Schema.Types.ObjectId, required: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Customer' },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'completed'
    },
    paymentMethod: { type: String, default: 'Credit Card' }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);