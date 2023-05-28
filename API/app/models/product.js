const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

const Product = Schema({
    persianName: { type: String, required: true },
    englishName: { type: String, required: true },
    rate: { type: Number },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    attribute: [{ type: Schema.Types.ObjectId, ref: 'ProductAttribute', required: true }],
    details: [{ type: Schema.Types.ObjectId, ref: 'ProductDetails', required: true }],
    brand: { type: Schema.Types.ObjectId, ref: 'Brand', required: true },
    description: { type: String },
    original: { type: String },
    images: [{ type: Schema.Types.ObjectId, ref: 'Multimedia' }]
});

Product.plugin(mongoosePaginate);

module.exports = mongoose.model('Product', Product);