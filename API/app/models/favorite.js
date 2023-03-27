const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

const Favorite = Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
});

Favorite.plugin(mongoosePaginate);

module.exports = mongoose.model('Favorite', Favorite)