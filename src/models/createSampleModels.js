var models = require('./index')

module.exports = function () {
  models.sequelize.sync().then(function () {
    return models.User.bulkCreate([
      { email: 'megh@gmail.com', password: 'password', name: 'Megh'},
      { email: 'megh2@gmail.com', password: 'password', name: 'Megh2'}
    ], { ignoreDuplicates: true })
  })
}
