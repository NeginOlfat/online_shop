const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

const Comment = Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    survey: [{ type: Schema.Types.ObjectId, ref: 'surveyValue' }],
    text: { type: String, required: true },
    like: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    disLike: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, {
    timestamps: true
});

Comment.plugin(mongoosePaginate);

module.exports = mongoose.model('Comment', Comment)