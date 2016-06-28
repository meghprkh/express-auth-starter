var jwt = require('jsonwebtoken');
var router = require('express').Router();
var config = require('./config');
var models = require('./models');
var middleware = require('./middleware');

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

  models.User.find({where : {
    email, password
  }}).then(user => {
    if (user) sendToken(user.id, res);
    else res.sendStatus(401);
  }).catch(next)
})

router.post ('/register',  middleware.isNotAuthenticated, (req, res, next) => {
  const { email, password, name } = req.body;

  return models.User.find({where : { email }}).then(user => {
    if (user) {
      if (user.password == password) sendToken(user.id, res);
      else res.sendStatus(401);
    } else {
      return models.User.create({
        email, password, name
      }).then(user => {
        sendToken(user.id, res);
      })
    }
  }).catch(next)
})

module.exports = router;
