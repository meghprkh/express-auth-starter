var models = require('./index')
var bcrypt = require('bcrypt');
var config = require('../config');

module.exports = function () {
  models.sequelize.sync().then(function () {
    return models.User.bulkCreate([
      { email: 'megh@gmail.com', password: bcrypt.hashSync('password', config.saltRounds), name: 'Megh'},
      { email: 'megh2@gmail.com', password: bcrypt.hashSync('password', config.saltRounds), name: 'Megh2'}
    ], { ignoreDuplicates: true })
  })
}
