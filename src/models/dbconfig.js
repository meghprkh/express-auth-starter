var Sequelize = require('sequelize');

var sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'db.sqlite'
});

module.exports = sequelize;
