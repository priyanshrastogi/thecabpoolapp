var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var cabrequestSchema = new Schema({
    from: {
        type: String,
        required: true,
    },
    to: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    description: {
        type: String,
    },
    cabProvider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CabProvider',
        required: true,
    },
    approved: {
        type: Number,
        default: 0,
        //0 for pending, 1 for approved, 2 for declined
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

}, {
        timestamps: true
    });

var CabRequests = mongoose.model('CabRequest', cabrequestSchema);

module.exports = CabRequests