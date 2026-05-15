const mongoos = require('mongoose');

const customerSchema = new mongoos.Schema({
    firstname: {type: String, required: true},
    surname: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    notifications: [{
        message: {type: String},
        date: {type: Date, default: Date.now},
        read: {type: Boolean, default: false}
    }]
}, {timestamps: true});

module.exports = mongoos.model('Customer', customerSchema);