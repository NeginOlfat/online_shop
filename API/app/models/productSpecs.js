const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

const ProductSpecs = Schema({
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    specs: { type: String, required: true },
    label: { type: String }
}, {
    toJSON: { virtuals: true }
});

ProductSpecs.virtual('details', {
    ref: 'ProductSpecsDetails',
    localField: '_id',
    foreignField: 'specs'
})

module.exports = mongoose.model('ProductSpecs', ProductSpecs);