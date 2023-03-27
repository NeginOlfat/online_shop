const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

const User = Schema({
    fname: { type: String },
    address: { type: String },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false }
}, {
    timestamps: true
});

User.plugin(mongoosePaginate);

User.statics.CreateToken = async (id, secretId, exp) => {
    return await jwt.sign({ id }, secretId, { expiresIn: exp });
}

User.statics.CheckToken = async (req, secretId) => {
    const token = req.headers['token'];
    if (token) {
        return await jwt.verify(token, secretId);
    } else {
        return null;
    }
}

User.statics.CheckUserInfo = async (user) => {
    let info = [];

    switch (true) {
        case user.fname == null:
            info.push({
                fname: 'نام را وارد کنید'
            });
        case user.address == null:
            info.push({
                address: 'آدرس را وارد کنید'
            });

        default:
            break;
    }

    return info;
}

module.exports = mongoose.model('User', User)