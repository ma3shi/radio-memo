'use strict';

//https://sequelize.org/master/index.html
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('postgres://postgres:postgres@db/radio-memo');

module.exports = {
  sequelize,
  DataTypes,
};
