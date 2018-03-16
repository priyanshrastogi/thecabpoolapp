var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var CabProviders = require('../models/cabproviders');
var cabProviderRouter = express.Router();
var authenticate = require('../authenticate');

cabProviderRouter.use(bodyParser.json());

cabProviderRouter.route('/')
.get((req, res, next) => {
    CabProviders.find({}).select('-__v -updatedAt').populate('owner', '-type -__v -_id')
    .then((cabproviders) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(cabproviders);
    }, (err) => next(err))
    .catch((err) => next(err));
})

.post(authenticate.verifyUser, (req, res, next) => {
    CabProviders.create(req.body)
    .then((cabprovider) => {
        console.log('Cab Request Created ', cabprovider);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(cabprovider);
    }, (err) => next(err))
    .catch((err) => next(err));
})

.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /cabrequests');
})

.delete(authenticate.verifyUser, (req, res, next) => {
    CabProviders.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

cabProviderRouter.route('/owner/:ownerId')
.get((req, res, next) => {
    CabProviders.find({owner:req.params.ownerId})
    .then((cabprovider) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(cabprovider);
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
})

cabProviderRouter.route('/:cabProviderId')
.get((req, res, next) => {
    CabProviders.findById(req.params.cabProviderId)
    .then((cabprovider) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(cabprovider);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST Method is not supported');
})
.put(authenticate.verifyUser, (req, res, next) => {
    CabProviders.findByIdAndUpdate(req.params.cabProviderId, {
        $set: req.body
    }, { new: true })
    .then((cabprovider) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(cabprovider);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(authenticate.verifyUser, (req, res, next) => {
    CabProviders.findByIdAndRemove(req.params.cabProviderId)
        .then((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
        }, (err) => next(err))
        .catch((err) => next(err));
});

cabProviderRouter.route('/:cabproviderId/pricelist')
.get((req,res,next) => {
    CabProviders.findById(req.params.cabproviderId)
    .then((cabprovider) => {
        if (cabprovider != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(cabprovider.priceList);
        }
        else {
            err = new Error('Cab Provider ' + req.params.cabproviderId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    CabProviders.findById(req.params.cabproviderId)
    .then((cabprovider) => {
        if (cabprovider != null) {
            cabprovider.priceList.push(req.body);
            cabprovider.save()
            .then((cabprovider) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(cabprovider);                
            }, (err) => next(err));
        }
        else {
            err = new Error('Cab Provider ' + req.params.cabproviderId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /cabproviders/' + req.params.cabproviderId + '/pricelist');
})
.delete((req, res, next) => {
    CabProviders.findById(req.params.cabproviderId)
    .then((cabprovider) => {
        if (cabprovider != null) {
            for (var i = (cabprovider.priceList.length -1); i >= 0; i--) {
                cabprovider.priceList.id(cabprovider.priceList[i]._id).remove();
            }
            cabprovider.save()
            .then((cabprovider) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(cabprovider);                
            }, (err) => next(err));
        }
        else {
            err = new Error('Cab Provider ' + req.params.cabprovider + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));    
});

cabProviderRouter.route('/:cabproviderId/pricelist/:pricelistId')
.get((req,res,next) => {
    CabProviders.findById(req.params.cabproviderId)
    .then((cabprovider) => {
        if (cabprovider != null && cabprovider.priceList.id(req.params.pricelistId) != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(cabprovider.priceList.id(req.params.pricelistId));
        }
        else if (cabprovider == null) {
            err = new Error('cabprovider ' + req.params.cabproviderId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('PriceList item ' + req.params.pricelistId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /cabproviders/'+ req.params.cabproviderId
        + '/pricelist/' + req.params.pricelistId);
})
.put((req, res, next) => {
    CabProviders.findById(req.params.cabproviderId)
    .then((cabprovider) => {
        if (cabprovider != null && cabprovider.priceList.id(req.params.pricelistId) != null) {
            if (req.body.point1) {
                cabprovider.priceList.id(req.params.pricelistId).point1 = req.body.point1;
            }
            if (req.body.point2) {
                cabprovider.priceList.id(req.params.pricelistId).point2 = req.body.point2;                
            }
            if (req.body.price) {
                cabprovider.priceList.id(req.params.pricelistId).price = req.body.price;
            }
            cabprovider.save()
            .then((cabprovider) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(cabprovider);                
            }, (err) => next(err));
        }
        else if (cabprovider == null) {
            err = new Error('cabprovider ' + req.params.cabproviderId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Pricelist item ' + req.params.pricelistId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete((req, res, next) => {
    CabProviders.findById(req.params.cabproviderId)
    .then((cabprovider) => {
        if (cabprovider != null && cabprovider.priceList.id(req.params.pricelistId) != null) {
            cabprovider.priceList.id(req.params.pricelistId).remove();
            cabprovider.save()
            .then((cabprovider) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(cabprovider);                
            }, (err) => next(err));
        }
        else if (cabprovider == null) {
            err = new Error('cabprovider ' + req.params.cabproviderId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('pricelist item ' + req.params.pricelistId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = cabProviderRouter;