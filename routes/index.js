'use strict';
const express = require('express'); //Expressモジュールを読み込む
const router = express.Router(); //Routerオブジェクトを呼び出す
const Memo = require('../models/memo');

/* GET home page. */
//nextを実行すると次のハンドラ(逐次処理を行っていく関数)が実行される
router.get('/', function (req, res, next) {
  const title = 'ラジオ視聴メモ';
  if (req.user) {
    Memo.findAll({
      where: {
        createdBy: req.user.id,
      },
      order: [['updatedAt', 'DESC']],
    }).then(memos => {
      res.render('index', {
        title: title,
        user: req.user,
        memos: memos,
      });
    });
  } else {
    res.render('index', { title: title, user: req.user });
  }
});

module.exports = router; // Routerオブジェクト自身をモジュールとして提供
