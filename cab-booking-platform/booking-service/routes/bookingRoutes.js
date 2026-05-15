const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

router.post('/', async (req, res) => {
    try{
        const { customerId, startLocation, endLocation, dateTime, passengers, cabType } = req.body;

        const newBooking = new Booking({ customerId, startLocation, endLocation, dateTime, passengers, cabType, status: 'current' });

        await newBooking.save();

        res.status(201).json({ message: 'Booking created successfully', bookingId: newBooking._id });

    }catch(error){
        res.status(500).json({ message: 'Error creating booking' });
    }

});

router.get('customer/:customerId/current', async (req, res) => {
    try{
        const currentBookings = await Booking.find({ customerId: req.params.customerId, status: 'current' }).sort({dateTime: 1});

        res.status(200).json(currentBookings);

    }catch(error){
        res.status(500).json({ message: 'Error fetching current bookings' });
    }

});


router.get('customer/:customerId/past', async (req, res) => {
    try{
        const pastBookings = await Booking.find({ customerId: req.params.customerId, status: { $in: ['completed', 'cancelled'] } }).sort({dateTime: -1});

        res.status(200).json(pastBookings);
    }catch(error){
        res.status(500).json({ message: 'Error fetching past bookings' });
    }


});

module.exports = router;