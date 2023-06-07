const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

const Payment = Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    products: [{
        product: { type: Schema.Types.ObjectId, ref: 'Product' },
        attribute: { type: Schema.Types.ObjectId, ref: 'ProductAttribute' },
    }],
    price: { type: Number, required: true },
    count: { type: Number },
    discount: { type: Number },
    orderStatus: { type: Schema.Types.ObjectId, ref: 'OrderStatus' },
    paymentStatus: { type: Boolean, default: false }
}, {
    timestamps: true
})

Payment.plugin(mongoosePaginate);

module.exports = mongoose.model('Payment', Payment)