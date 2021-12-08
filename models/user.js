'use strict';
const { sequelize, DataTypes } = require('./sequelize-loader');

const User = sequelize.define(
  'users', //Sequelizeは、デフォルトではモデル名の複数形をテーブル名として使用
  {
    //GitHub のユーザー ID、主キー
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true, //主キー
      allowNull: false, // null値を許可しない
    },
    //GitHub のユーザー名
    username: {
      type: DataTypes.STRING,
      allowNull: false, // null値を許可しない
    },
  },
  {
    freezeTableName: true, //テーブル名とモデル名を一致させるための設定
    timestamps: false, //テーブルにタイムスタンプを表す列（updatedAtやcreatedAt）を作成しないための設定
  }
);

module.exports = User; //モジュールとして設定
