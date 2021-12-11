'use strict';
const express = require('express');
const router = express.Router();
const authenticationEnsurer = require('./authentication-ensurer'); //認証をしているかチェックする関数

const Memo = require('../models/memo');

router.get('/new', authenticationEnsurer, (req, res, next) => {
  res.render('new', { user: req.user });
});

router.post('/', authenticationEnsurer, (req, res, next) => {
  const updatedAt = new Date();

  switch (req.url) {
    //登録
    case '/':
      Memo.create({
        memoId: Memo.memoId,
        programName: req.body.programName.slice(0, 255) || '（番組名未設定）',
        personality:
          req.body.personality.slice(0, 255) || '（パーソナリティ未設定）',
        airtime: req.body.airtime.slice(0, 255) || '（放送時間未設定）',
        impression: req.body.impression,
        createdBy: req.user.id,
        updatedAt: updatedAt,
      }).then(memo => {
        res.redirect('/'); //トップ画面に転送
      });
      break;

    //削除
    case '/?delete=1':
      Memo.findByPk(req.body.memoId)
        .then(memo => {
          memo.destroy();
        })
        .then(() => {
          res.redirect('/'); //トップ画面に転送
        });
  }
});

module.exports = router;
