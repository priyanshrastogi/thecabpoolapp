var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require('passport');
var User = require('../models/users');
var mailer = require('../mailer');
var authenticate = require('../authenticate');
var router = express.Router();

/* GET users listing. */
router.get('/', (req, res, next) => {
  User.find({})
    .then((users) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(users);
    }, (err) => next(err))
    .catch((err) => next(err));
})

router.get('/:userId', (req, res, next) => {
  User.findById(req.params.userId)
  .then((user) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(user);
    }, (err) => next(err))
    .catch((err) => next(err));
})

router.post('/signup', function(req,res,next) {
  User.register(new User({username:req.body.username, name:req.body.name, phone:req.body.phone, type:req.body.type}), req.body.password,
  (err, user) => {
    if(err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err})
    }
    else {
      passport.authenticate('local')(req, res, () => {
      var token = authenticate.getToken({ _id: req.user._id });
      res.statusCode = 200;
      res.setHeader('Content-Type','application/json');
      
      res.json({ success: true, status: 'Registration Successful', token: token, user: { _id: user._id, name: user.name, username: user.username }});
      if(user.type == 1) {
        mailer.sendWelcome2Mail(user.username, user.name);
      }
      else {
        mailer.sendWelcomeMail(user.username, user.name);
      }
    });
    }
  });
});

router.post('/login', passport.authenticate('local'), (req, res) => {
  var token = authenticate.getToken({_id: req.user._id});
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({ success: true, token: token, user: { _id: req.user._id, name: req.user.name, username: req.user.username }});
});

router.get('/resetpassword', (req, res) => {

})

module.exports = router;
