const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

const Category = Schema({
    name: { type: String, required: true },
    parent: { type: Schema.Types.ObjectId, ref: 'Category' },
    image: { type: Schema.Types.ObjectId, ref: 'Multimedia', required: true }
})

Category.plugin(mongoosePaginate);

module.exports = mongoose.model('Category', Category)