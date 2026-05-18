const express = require('express');
const router = express.Router();
const axios = require('axios');
const Payment = require('../models/Payment');


router.post('/estimate', async (req, res) => {
    try {
        const { 
            bookingId, customerId, cabType, passengers, dateTime, discount = 0, 
            dep_lat, dep_lng, arr_lat, arr_lng 
        } = req.body;

        const options = {
            method: 'GET',
            url: 'https://taxi-fare-calculator.p.rapidapi.com/search-geo',
            params: { 
                dep_lat: dep_lat,
                dep_lng: dep_lng,
                arr_lat: arr_lat,
                arr_lng: arr_lng
            },            
            headers: {
                'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
                'X-RapidAPI-Host': 'taxi-fare-calculator.p.rapidapi.com'
            }
        };

        const apiResponse = await axios.request(options);
        
        if (apiResponse.data && apiResponse.data.journey && apiResponse.data.journey.fares.length > 0) {
            const priceInCents = apiResponse.data.journey.fares[0].price_in_cents;
            if (priceInCents === "n/a") return res.status(400).json({ message: 'Fare calculation unavailable for this route.' });
            
            let cab_fare = priceInCents / 100; 

            let cab_multiplier = (cabType === 'Premium') ? 1.2 : (cabType === 'Executive') ? 1.4 : 1;
            const hour = new Date(dateTime).getUTCHours();
            let daytime_multiplier = (hour >= 0 && hour < 8) ? 1.2 : 1;
            let passengers_multiplier = (passengers >= 5 && passengers <= 8) ? 2 : 1;

            let totalPrice = (cab_fare * cab_multiplier * daytime_multiplier * passengers_multiplier);
            
            return res.status(200).json({ estimatedPrice: totalPrice });
        } else {
            return res.status(400).json({ message: 'Could not calculate a fare for the provided locations.' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'The external fare calculator is offline.' });
    }
});


router.post('/pay', async (req, res) => {
    try {
        const { 
            bookingId, customerId, cabType, passengers, dateTime, discount = 0, 
            dep_lat, dep_lng, arr_lat, arr_lng 
        } = req.body;

        if (passengers > 8) { 
            return res.status(400).json({ message: 'Maximum passengers allowed is 8' });
        }

        const options = {
            method: 'GET',
            url: 'https://taxi-fare-calculator.p.rapidapi.com/search-geo',
            params:{
                dep_lat: dep_lat,
                dep_lng: dep_lng,
                arr_lat: arr_lat,
                arr_lng: arr_lng
            },            
            headers: {
                'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
                'X-RapidAPI-Host': 'taxi-fare-calculator.p.rapidapi.com'
            }
        };

        let cab_fare = null; 

        try {
            const apiResponse = await axios.request(options);
            
            if (apiResponse.data && apiResponse.data.journey && apiResponse.data.journey.fares.length > 0) {
                const priceInCents = apiResponse.data.journey.fares[0].price_in_cents;
                
                if (priceInCents !== "n/a") {
                    cab_fare = priceInCents / 100; 
                    console.log(`API Fare successfully fetched: €${cab_fare}`);
                } else {
                    return res.status(400).json({ message: 'Fare calculation unavailable for this route right now.' });
                }
            } else {
                return res.status(400).json({ message: 'Could not calculate a fare for the provided locations.' });
            }
        } catch (error) {
            console.error('API Error:', error.message);
            return res.status(500).json({ message: 'The external fare calculator service is temporarily offline.' });
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

        const newPayment = new Payment({ bookingId, customerId, amount: totalPrice, status: 'completed' });
        await newPayment.save();

        res.status(200).json({ message: 'Payment processed successfully', amount: totalPrice });
    } catch (error) {
        console.log("ACTUAL ERROR:", error); 
        res.status(500).json({ message: 'Error processing payment' });
    }
});


router.get('/:paymentId', async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.paymentId); 
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.status(200).json(payment);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching payment details' });
    }
});

module.exports = router;