var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var PoolRequests = require('../models/poolrequests');
var User = require('../models/users');
var poolRequestRouter = express.Router();
var authenticate = require('../authenticate');
var mailer = require('../mailer');

poolRequestRouter.use(bodyParser.json());

poolRequestRouter.route('/')
.get((req, res, next) => {
    PoolRequests.find({}).sort('-createdAt').select('-__v -updatedAt').populate('postedBy','-type -__v -_id')
    .then((poolrequests) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(poolrequests);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {
    PoolRequests.create({
        from: req.body.from,
        to: req.body.to,
        date: req.body.date,
        description: req.body.description,
        postedBy: req.user._id
    })
    .then((poolrequest) => {
        //console.log('Pool Request Created ',poolrequest);
        User.findById(req.user._id)
        .then((user) => {
            user.poolrequests.push(poolrequest._id);
            user.save();
        }, (err) => next(err));
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(poolrequest);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put((req, res, next) => {
res.statusCode = 403;
res.end('PUT operation not supported on /poolrequests');
})
.delete(authenticate.verifyUser, (req, res, next) => {
/*PoolRequests.remove({})
.then((resp) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(resp);
}, (err) => next(err))
.catch((err) => next(err));*/
res.statusCode = 403;
res.end('DELETE operation not supported on /poolrequests');
});

poolRequestRouter.route('/:poolRequestId')
.get((req, res, next) => {
    PoolRequests.findById(req.params.poolRequestId).select('-__v -updatedAt').populate('postedBy', '-type -__v -_id')
    .then((poolrequests) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(poolrequests);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST Method is not supported');
})
.put(authenticate.verifyUser, (req, res, next) => {
PoolRequests.findByIdAndUpdate(req.params.poolRequestId, {
    $set: req.body
    }, {new : true})
    .then((poolrequest) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(poolrequest);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(authenticate.verifyUser, (req, res, next) => {
    PoolRequests.findByIdAndRemove(req.params.poolRequestId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

poolRequestRouter.route('/:poolRequestId/interested')
.get((req, res, next) => {
    res.statusCode = 403;
    res.end('GET Method is not supported');
})
.post(authenticate.verifyUser, (req, res, next) => {
    PoolRequests.findById(req.params.poolRequestId).populate('postedBy')
    .then((poolrequest) => {
        if (poolrequest != null) {
            console.log(req.user._id);
            poolrequest.interested.push(req.user._id);
            console.log("done");
            poolrequest.save()
            .then((poolrequest) => {
                User.findById(req.user._id)
                .then((user) => {
                    mailer.sendInterestMail(user, poolrequest);    
                }, (err) => next(err));
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(poolrequest);                
            }, (err) => next(err));
        }
        else {
            err = new Error('Pool Request ' + req.params.poolRequestId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT Method is not supported');
})
.delete((req, res, next) => {
    res.statusCode = 403;
    res.end('DELETE Method is not supported');
    /*
    PoolRequests.findById(req.params.poolRequestId)
    .then((poolrequest) => {
        if (poolrequest != null) {
            //console.log(req.user._id);
            for(var i=0; i<poolrequest.interested.length; i++) {
                if (poolrequest.interested[i] == req.user._id) {
                    poolrequest.interested.splice(i, 1);
                }
            }
            poolrequest.save()
            .then((poolrequest) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(poolrequest);                
            }, (err) => next(err));
        }
        else if (poolrequest == null) {
            err = new Error('Pool Request ' + req.params.poolRequestId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('User Id ' + req.user._id + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
    */
});

poolRequestRouter.route('/:poolRequestId/accept/:userId')
.get((req, res, next) => {
    res.statusCode = 403;
    res.end('GET Method is not supported');
})
.post(authenticate.verifyUser, (req, res, next) => {
    PoolRequests.findById(req.params.poolRequestId).populate('postedBy')
    .then((poolrequest) => {
        if (poolrequest != null) {
            poolrequest.poolmates.push(req.params.userId);
            for (var i = 0; i < poolrequest.interested.length; i++) {
                if (poolrequest.interested[i] == req.params.userId) {
                    poolrequest.interested.splice(i, 1);
                }
            }
            poolrequest.save()
            .then((poolrequest) => {
                User.findById(req.params.userId)
                .then((user) => {
                    mailer.sendAcceptMail(user.username, user.name, poolrequest);
                }, (err) => next(err));            
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(poolrequest);                
            }, (err) => next(err));
        }
        else {
            err = new Error('Pool Request ' + req.params.poolRequestId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT Method is not supported');
})
.delete(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('DELETE Method is not supported');
    /*PoolRequests.findById(req.params.poolRequestId)
    .then((poolrequest) => {
        if (poolrequest != null) {
            poolrequest.interested.push(req.params.userId);
            for (var i = 0; i < poolrequest.poolmates.length; i++) {
                if (poolrequest.poolmates[i] == req.params.userId) {
                    poolrequest.poolmates.splice(i, 1);
                }
            }
            poolrequest.save()
            .then((poolrequest) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(poolrequest);                
            }, (err) => next(err));
        }
        else if (poolrequest == null) {
            err = new Error('Pool Request ' + req.params.poolRequestId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('User Id ' + req.params.userId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));*/
});

poolRequestRouter.route('/:poolRequestId/decline/:userId')
.get((req, res, next) => {
    res.statusCode = 403;
    res.end('GET Method is not supported');
})
.post(authenticate.verifyUser, (req, res, next) => {
    PoolRequests.findById(req.params.poolRequestId).populate('postedBy')
    .then((poolrequest) => {
        if (poolrequest != null) {
            for (var i = 0; i < poolrequest.interested.length; i++) {
                if (poolrequest.interested[i] == req.params.userId) {
                    poolrequest.interested.splice(i, 1);
                }
            }
            poolrequest.save()
            .then((poolrequest) => {
                User.findById(req.params.userId)
                .then((user) => {
                    mailer.sendDeclineMail(user.username, user.name, poolrequest);
                }, (err) => next(err));            
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(poolrequest);                
            }, (err) => next(err));
        }
        else {
            err = new Error('Pool Request ' + req.params.poolRequestId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT Method is not supported');
})
.delete(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('DELETE Method is not supported');
});



module.exports = poolRequestRouter;