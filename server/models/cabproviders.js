var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pricelistSchema = new Schema({
    point1: {
        type: String,
        required: true,
    },
    point2: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    }
});

var cabproviderSchema = new Schema({
    name: {
        type: String,
        required: true,
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    
    priceList: [pricelistSchema],

    email: {
        type:String,
        required: true,
    },

    contact: {
        type: String,
        required: true,
    }
});

var CabProvider = mongoose.model('CabProvider', cabproviderSchema);

module.exports = CabProvider