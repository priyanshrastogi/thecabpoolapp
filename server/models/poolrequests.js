var mongoose = require('mongoose');
var Schema  = mongoose.Schema;

var poolrequestSchema = new Schema({
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
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    interested: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    poolmates: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
},{
    timestamps: true
});

var PoolRequests = mongoose.model('PoolRequest', poolrequestSchema);

module.exports = PoolRequests