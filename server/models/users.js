var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new Schema({
    name: {
        type: String,
        required: true
    },

    phone: {
        type: String,
    },

    type: {
        type: Number,
        default: 0,
    },

    poolrequests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PoolRequest'
    }],

    cabrequests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CabRequest'
    }]
})

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User',userSchema);