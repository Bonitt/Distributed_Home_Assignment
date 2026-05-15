const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');

router.post('/register', async (req, res) => {
    try{
        const { firstname, surname, email, password } = req.body;

        const newCustomer = new Customer({ firstname, surname, email, password });
        await newCustomer.save();

        res.status(201).json({ message: 'Customer registered successfully' });

    }catch(error){
        res.status(500).json({ message: 'Error registering customer' });

    }
});

router.post('/login', async (req, res) => {
    try{
        const { email, password } = req.body;
        const customer = await Customer.findOne({ email, password });

        if(!customer){
            return res.status(401).json({error: 'Invalid email or password' });

        }

        res.json({ message: 'Login successful', customerId: customer._id });

    }catch(error){
        res.status(500).json({ message: 'Error logging in' });
    }
});

router.get('/:id', async (req,res) => {
   try{
    const customer = await Customer.findById(req.params.id).select('-password');

    if(!customer){
        return res.status(404).json({ message: 'Customer not found' });

    }

        res.status(200).json(customer);
   } catch(error){
        res.status(500).json({ message: 'Error fetching customer details' });

   }

});

router.get('/:id/notifications', async (req,res) => {
    try {
        const customer = await Customer.findById(req.params.id);

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });

        }

        res.json(customer.notifications);

    } catch(error) {
        res.status(500).json({ message: 'Error fetching customer notifications' });
    }


});

module.exports = router;