// config/database.js

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('csv', 'postgres', 'root', {
  host: 'localhost',
  dialect: 'postgres',
});

module.exports = sequelize;
