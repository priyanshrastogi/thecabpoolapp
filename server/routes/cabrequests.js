var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var CabRequests = require('../models/cabrequests');
var CabProviders = require('../models/cabproviders');
var User = require('../models/users');
var cabRequestRouter = express.Router();
var authenticate = require('../authenticate');
var mailer = require('../mailer');

cabRequestRouter.use(bodyParser.json());

cabRequestRouter.route('/')
.get((req, res, next) => {
    CabRequests.find({}).sort('-createdAt').select('-__v -updatedAt').populate('postedBy', '-type -__v -_id').populate('cabProvider','-__v -_id -owner -priceList')
    .then((cabrequests) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(cabrequests);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {
    CabRequests.create({
        from: req.body.from,
        to: req.body.to,
        date: req.body.date,
        cabProvider: req.body.cabProvider,
        description: req.body.description,
        postedBy: req.user._id,
    })
    .then((cabrequest) => {
        //console.log('Cab Request Created ', cabrequest);
        User.findById(req.user._id)
        .then((user) => {
            user.cabrequests.push(cabrequest._id);
        }, (err) => next(err));
        CabProviders.findById(cabrequest.cabProvider)
        .then((cabprovider) => {
            mailer.sendCabRequestMail(cabprovider, cabrequest);
        }, (err) => next(err));
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(cabrequest);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /cabrequests');
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    CabRequests.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

cabRequestRouter.route('/approved/:cabproviderId')
.get((req, res, next) => {
    CabRequests.find({ approved: 1, cabProvider: req.params.cabproviderId }).sort('-createdAt').select('-__v -updatedAt').populate('postedBy', '-type -__v -_id').populate('cabProvider', '-__v -_id -owner -priceList')
    .then((cabrequests) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(cabrequests);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST Method is not supported');
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT Method is not supported');
})
.delete((req, res, next) => {
    res.statusCode = 403;
    res.end('DELETE Method is not supported');
});

cabRequestRouter.route('/unapproved/:cabproviderId')
.get((req, res, next) => {
    CabRequests.find({ approved: 0, cabProvider: req.params.cabproviderId }).sort('-createdAt').select('-__v -updatedAt').populate('postedBy', '-type -__v -_id').populate('cabProvider', '-__v -_id -owner -priceList')
    .then((cabrequests) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(cabrequests);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST Method is not supported');
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT Method is not supported');
})
.delete((req, res, next) => {
    res.statusCode = 403;
    res.end('DELETE Method is not supported');
});

cabRequestRouter.route('/:cabRequestId')
.get((req, res, next) => {
    CabRequests.findById(req.params.cabRequestId).select('-__v -updatedAt').populate('postedBy', '-type -__v -_id').populate('cabProvider', '-__v -_id -owner -priceList')
    .then((cabrequests) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(cabrequests);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST Method is not supported');
})
.put(authenticate.verifyUser, (req, res, next) => {
    CabRequests.findByIdAndUpdate(req.params.cabRequestId, {
        $set: req.body
    }, { new: true })
    .then((cabrequest) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(cabrequest);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(authenticate.verifyUser, (req, res, next) => {
    CabRequests.findByIdAndRemove(req.params.cabRequestId)
        .then((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
        }, (err) => next(err))
        .catch((err) => next(err));
});

cabRequestRouter.route('/:cabRequestId/approve')
.get((req, res, next) => {
    res.statusCode = 403;
    res.end('GET Method is not supported');
})
.post(authenticate.verifyUser, authenticate.verifyCabProvider, (req, res, next) => {
    CabRequests.findByIdAndUpdate(req.params.cabRequestId, {
        approved: 1
    }, { new: true }).populate('cabProvider postedBy')
    .then((cabrequest) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(cabrequest);
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
});

cabRequestRouter.route('/:cabRequestId/decline')
.get((req, res, next) => {
    res.statusCode = 403;
    res.end('GET Method is not supported');
})
.post(authenticate.verifyUser, authenticate.verifyCabProvider, (req, res, next) => {
    CabRequests.findByIdAndUpdate(req.params.cabRequestId, {
        approved: 2
    }, { new: true })
    .then((cabrequest) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(cabrequest);
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
});
module.exports = cabRequestRouter;