const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

const Brand = Schema({
    name: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    image: { type: String }
})

Brand.plugin(mongoosePaginate);

module.exports = mongoose.model('Brand', Brand)