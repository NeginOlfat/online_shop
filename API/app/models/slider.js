const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

const Slider = Schema({
    images: [{ type: Schema.Types.ObjectId, ref: 'Multimedia', required: true }],
    name: { type: String, required: true },
    default: { type: Boolean, default: false }
});

module.exports = mongoose.model('Slider', Slider)