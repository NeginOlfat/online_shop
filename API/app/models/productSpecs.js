const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

const ProductSpecs = Schema({
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    specs: { type: String, required: true },
    label: { type: String }
});

ProductSpecs.plugin(mongoosePaginate);

module.exports = mongoose.model('ProductSpecs', ProductSpecs);