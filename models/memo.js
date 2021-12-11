'use strict';
const { sequelize, DataTypes } = require('./sequelize-loader');

const Memo = sequelize.define(
  'memos', //Sequelizeは、デフォルトではモデル名の複数形をテーブル名として使用
  {
    //メモID
    memoId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true, //主キー
      allowNull: false, // null値を許可しない
    },
    //番組名
    programName: {
      type: DataTypes.STRING, //255 文字までの長さを保存できる設定
      allowNull: false, // null値を許可しない
    },
    //パーソナリティ
    personality: {
      type: DataTypes.STRING, //255 文字までの長さを保存できる設定
      allowNull: false, // null値を許可しない
    },
    //放送日時
    airtime: {
      type: DataTypes.STRING, //255 文字までの長さを保存できる設定
      allowNull: false, // null値を許可しない
    },
    //感想
    impression: {
      type: DataTypes.TEXT, //制限のない大きな長い文字列を保存できる設定
      allowNull: false, // null値を許可しない
    },
    //作成者、ユーザーID
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false, // null値を許可しない
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    freezeTableName: true, //テーブル名とモデル名を一致させるための設定
    timestamps: false, //テーブルにタイムスタンプを表す列（updatedAtやcreatedAt）を作成しないための設定
  }
);

module.exports = Memo; //モジュールとして設定
