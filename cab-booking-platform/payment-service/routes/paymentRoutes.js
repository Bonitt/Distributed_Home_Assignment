const express = require('express');
const router = express.Router();
const axios = require('axios');
const Payment = require('../models/Payment');

router.post('/pay', async (req, res) => {
    try {
        const { bookingId, customerId, cabType, passengers, dateTime, discount = 0 } = req.body;

        if (passengers > 8) {
            return res.status(400).json({ message: 'Maximum passengers allowed is 8' });
        }

        const options = {
            method: 'GET',
            url: 'https://cab-fare-calculator.p.rapidapi.com/calculateFare',
            headers: {
                'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
                'X-RapidAPI-Host': 'cab-fare-calculator.p.rapidapi.com'
            }
        };

        let cab_fare = 20;
        try {
            const response = await axios.request(options);
            cab_fare = response.data.fare;
        } catch (error) {
            console.error('Error fetching fare from API, using default fare:', error.message);
        }

        let cab_multiplier = 1;
        if (cabType === 'Premium') {
            cab_multiplier = 1.2;
        } else if (cabType === 'Executive') {
            cab_multiplier = 1.4;
        }

        const bookingDate = new Date(dateTime);
        const hour = bookingDate.getUTCHours();

        let daytime_multiplier = 1;
        if (hour >= 0 && hour < 8) {
            daytime_multiplier = 1.2;
        }

        let passengers_multiplier = 1;
        if (passengers >= 5 && passengers <= 8) {
            passengers_multiplier = 2;
        }

        let totalPrice = (cab_fare * cab_multiplier * daytime_multiplier * passengers_multiplier) - discount;
        totalPrice = Math.max(totalPrice, 0);

        // Fixed the status from 'paid' to 'completed'
        const newPayment = new Payment({ bookingId, customerId, amount: totalPrice, status: 'completed' });
        await newPayment.save();

        res.status(200).json({ message: 'Payment processed successfully', amount: totalPrice });
    } catch (error) {
        console.log("ACTUAL ERROR:", error); // This will tell you exactly what fails in the terminal!
        res.status(500).json({ message: 'Error processing payment' });
    }
});

router.get('/:paymentId', async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.paymentId); // Fixed Payment.Date typo
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.status(200).json(payment);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching payment details' });
    }
});

module.exports = router;