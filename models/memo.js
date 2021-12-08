'use strict';
const { sequelize, DataTypes } = require('./sequelize-loader');

const Memo = sequelize.define(
  'memos', //Sequelizeは、デフォルトではモデル名の複数形をテーブル名として使用
  {
    //メモID
    memoId: {
      type: DataTypes.INTEGER,
      primaryKey: true, //主キー
      allowNull: false, // null値を許可しない
    },
    //番組名
    programName: {
      type: DataTypes.STRING,
      allowNull: false, // null値を許可しない
    },
    //パーソナリティ
    personality: {
      type: DataTypes.STRING,
      allowNull: false, // null値を許可しない
    },
    //放送日時
    airtime: {
      type: DataTypes.STRING,
      allowNull: false, // null値を許可しない
    },
    //評価
    valuation: {
      type: DataTypes.INTEGER,
      allowNull: false, // null値を許可しない
    },
    //感想
    impression: {
      type: DataTypes.TEXT,
      allowNull: false, // null値を許可しない
    },
    //作成者、ユーザーID
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false, // null値を許可しない
    },
  },
  {
    freezeTableName: true, //テーブル名とモデル名を一致させるための設定
    timestamps: false, //テーブルにタイムスタンプを表す列（updatedAtやcreatedAt）を作成しないための設定
  }
);

module.exports = Memo; //モジュールとして設定
