const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

const ProductAttribute = Schema({
    seller: { type: Schema.Types.ObjectId, ref: 'Seller', required: true },
    color: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    discount: { type: Number, required: true },
});

module.exports = mongoose.model('ProductAttribute', ProductAttribute);