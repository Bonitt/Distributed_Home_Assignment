const express = require('express');
const router = express.Router();
const axios = require('axios');
const Location = require('../models/location');


router.post('/', async (req, res) => {
    try{
        const { customerId, name, address } = req.body;
        const newLocation = new Location({ customerId, name, address });
        await newLocation.save();
        res.status(201).json({ message: 'Location added successfully', location: newLocation });

    }catch(error){
        res.status(500).json({ message: 'Error adding location', error: error.message });
    }

});

router.get('/customer/:customerId', async (req, res) => {
    try{
        const locations = await Location.find({ customerId: req.params.customerId });
        res.status(200).json(locations);

    }catch(error){
        res.status(500).json({ message: 'Error fetching locations', error: error.message });
    }


});

router.put('/:locationId', async (req, res) => {
    try{
        const { name, address } = req.body;
        const updatedLocation = await Location.findByIdAndUpdate(req.params.locationId, { name, address }, { new: true });

        if(!updatedLocation){
            return res.status(404).json({ message: 'Location not found' });
        }
        res.status(200).json({ message: 'Location updated successfully', location: updatedLocation });

    }catch(error){
        res.status(500).json({ message: 'Error updating location', error: error.message });
    }

});

router.delete('/:locationId', async (req, res) => {
    try{
        const deletedLocation = await Location.findByIdAndDelete(req.params.locationId);
        if(!deletedLocation){
            return res.status(404).json({ message: 'Location not found' });
        }
        res.status(200).json({ message: 'Location deleted successfully' });

    }catch(error){
        res.status(500).json({ message: 'Error deleting location', error: error.message });
    }

});


router.get('/:locationId/weather', async (req, res) => {
    try {
        const location = await Location.findById(req.params.locationId);
        if (!location) {
            return res.status(404).json({ message: 'Location not found' });
        }

        const options = {
            method: 'GET',
            url: 'https://weatherapi-com.p.rapidapi.com/current.json',
            params: { q: location.address },
            headers: {
                'X-RapidAPI-Key': process.env.WEATHER_API_KEY, 
                'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
            }
        };

        const response = await axios.request(options);
        
        res.status(200).json({
            location: location.name,
            address: location.address,
            weather: {
                temperature: response.data.current.temp_c,
                condition: response.data.current.condition.text,
                humidity: response.data.current.humidity,
            }
        });

    } catch (error) {
        console.log("ACTUAL ERROR:", error.message); 
        res.status(500).json({ message: 'Error fetching weather data', error: error.message });
    }
});

module.exports = router;