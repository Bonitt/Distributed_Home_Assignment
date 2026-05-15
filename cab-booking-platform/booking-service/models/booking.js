const mongoos = require('mongoose');

const bookingSchema = new mongoos.Schema({
    customerId: { type: mongoos.Schema.Types.ObjectId, ref: 'Customer', required: true },
    startLocation: {type: String, required: true},
    endLocation: {type: String, required: true},
    dateTime: {type: String, required: true},
    passengers: {type: Number, requied: true, min: 1, max: 8},
    cabType:{
        type: String,
        enum: ['Economic', 'Premium', 'Executive'],
        required: true
    },
    status:{
        type: String,
        enum: ['current','completed', 'cancelled'],
        default: 'current'
    }


}, {timestamps: true});

module.exports = mongoos.model('Booking', bookingSchema);