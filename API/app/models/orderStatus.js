const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderStatus = Schema({
    name: { type: String, required: true },
    image: { type: String },
    default: { type: Boolean }
});

module.exports = mongoose.model('OrderStatus', OrderStatus)