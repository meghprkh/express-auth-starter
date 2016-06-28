var jwt = require('jsonwebtoken');
var config = require('./config');
var models = require('./models');

function jwtToUser (token, done) {
  jwt.verify(token, config.secret, function(err, decoded) {
    if (!decoded) {done(null, false); return;}
    models.User.findById(decoded.sub, {attributes: {exclude: ['password']}}).then(user => {
      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    }).catch(err => done(err));
  })
}

function isAuthenticated (req, res, next) {
  var token = req.header('Authorization');
  jwtToUser (token, function (err, user) {
    if (err) {
      next(err);
    } else if (!user) {
      res.sendStatus(403);
    } else {
      req.user = user;
      next();
    }
  })
}

function isNotAuthenticated (req, res, next) {
  var token = req.header('Authorization');
  jwtToUser (token, function (err, user) {
    if (err) {
      next(err);
    } else if (user) {
      res.sendStatus(403);
    } else {
      next();
    }
  })
}

function maybeAuthenticated (req, res, next) {
  var token = req.header('Authorization');
  jwtToUser (token, function (err, user) {
    if (err) {
      next(err);
    } else {
      req.user = user;
      next();
    }
  })
}

module.exports = {
  jwtToUser,
  isAuthenticated,
  isNotAuthenticated,
  maybeAuthenticated
}
