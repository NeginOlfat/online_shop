const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

const Multimedia = Schema({
    name: { type: String, required: true },
    dimWidth: { type: String },
    dimHeight: { type: String },
    dir: { type: String, required: true },
    format: { type: String }
}, {
    timestamps: true
});

Multimedia.plugin(mongoosePaginate);

module.exports = mongoose.model('Multimedia', Multimedia)