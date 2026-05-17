const express = require('express');
const router = express.Router();
const axios = require('axios');
const Booking = require('../models/Booking');

router.post('/', async (req, res) => {
    try {
        const { customerId, startLocation, endLocation, dateTime, passengers, cabType } = req.body;
        
        const newBooking = new Booking({ customerId, startLocation, endLocation, dateTime, passengers, cabType });
        await newBooking.save();

        const totalBookings = await Booking.countDocuments({ customerId: customerId });

        if (totalBookings === 3) {
            try {
                await axios.post(`http://localhost:3001/api/customers/${customerId}/notifications`, {
                    message: "Congratulations! You have unlocked a discount multiplier for completing 3 rides!",
                    type: "discount"
                });
                console.log(`[EVENT FIRED] Discount notification sent to customer: ${customerId}`);
            } catch (eventError) {
                console.log("[EVENT ERROR] Failed to send discount notification:", eventError.message);
            }
        }

        res.status(201).json({ message: 'Booking created successfully', booking: newBooking });

    } catch (error) {
        res.status(500).json({ message: 'Error creating booking', error: error.message });
    }
});

router.get('/customer/:customerId/current', async (req, res) => {
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