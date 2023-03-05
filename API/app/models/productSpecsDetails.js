const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

const ProductSpecsDetails = Schema({
    specs: { type: Schema.Types.ObjectId, ref: 'ProductSpecs', required: true },
    name: { type: String, required: true },
    label: { type: String }
});

ProductSpecsDetails.plugin(mongoosePaginate);

module.exports = mongoose.model('ProductSpecsDetails', ProductSpecsDetails);