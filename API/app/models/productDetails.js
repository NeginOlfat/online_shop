const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

const ProductDetails = Schema({
    productSpecsDetails: { type: Schema.Types.ObjectId, ref: 'ProductSpecsDetails', required: true },
    value: { type: String, required: true }
});


module.exports = mongoose.model('ProductDetails', ProductDetails);