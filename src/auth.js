var jwt = require('jsonwebtoken');
var router = require('express').Router();
var config = require('./config');
var models = require('./models');
var middleware = require('./middleware');
var bcrypt = require('bcrypt');

function sendToken (user_id, res) {
  jwt.sign({}, config.secret, { subject: user_id.toString(), expiresIn: "2h" }, function (err, token) {
    if (err != null) {
      throw err;
    } else {
      res.send({token: token});
    }
  });
}

router.post ('/login', middleware.isNotAuthenticated, (req, res, next) => {
  const { email, password } = req.body;
  if (typeof email != 'string' || typeof password != 'string') {
    res.sendStatus(400);
    return;
  }

  models.User.find({where : { email }}).then(user => {
    if (user) {
      bcrypt.compare(password, user.password, function(err, response) {
        if (err) return next (err);
        if (response == true) sendToken(user, res);
        else res.sendStatus(401);
      });
    } else {
      res.sendStatus (401)
    }
  }).catch(next)
})

router.post ('/register',  middleware.isNotAuthenticated, (req, res, next) => {
  const { email, password, name } = req.body;

  return models.User.find({where : { email }}).then(user => {
    if (user) {
      bcrypt.compare(password, user.password, function(err, response) {
        if (err) return next (err);
        if (response == true) sendToken(user, res);
        else res.sendStatus(401);
      });
    } else {
      bcrypt.hash(password, config.saltRounds, function(err, hash) {
        // Store hash in your password DB.
        if (err) return next (err);
        return models.User.create({
          email, hash, name
        }).then(user => {
          sendToken(user, res);
        })
      });
    }
  }).catch(next)
})

module.exports = router;
