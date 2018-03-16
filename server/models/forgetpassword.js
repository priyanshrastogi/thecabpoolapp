var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var forgetPasswordTokenSchema = new Schema({
    token: {
        type: String,
        required: true,
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    createdAt: { type: Date, expires: '1d' }

});

var ForgetPasswordToken = mongoose.model('ForgetPasswordToken', forgetPasswordTokenSchema);

module.exports = ForgetPasswordToken;