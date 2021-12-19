'use strict';

//https://sequelize.org/master/index.html
const { Sequelize, DataTypes } = require('sequelize');

const dialectOptions = {
  ssl: {
    require: true,
    rejectUnauthorized: false,
  },
};
const sequelize = process.env.DATABASE_URL
  ? // 本番環境
    new Sequelize(process.env.DATABASE_URL, {
      logging: false,
      dialectOptions,
    })
  : // 開発環境
    new Sequelize('postgres://postgres:postgres@db/radio-memo', {
      logging: false,
    });
module.exports = {
  sequelize,
  DataTypes,
};
