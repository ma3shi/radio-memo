'use strict';
const express = require('express');
const router = express.Router();
const authenticationEnsurer = require('./authentication-ensurer'); //認証をしているかチェックする関数

const Memo = require('../models/memo');

//登録画面へ
router.get('/new', authenticationEnsurer, (req, res, next) => {
  res.render('new', { user: req.user });
});

//変更画面へ
router.get('/:memoId', authenticationEnsurer, (req, res, next) => {
  Memo.findByPk(req.params.memoId).then(memo => {
    console.log(memo);
    res.render('edit', { user: req.user, memo: memo });
  });
});

//削除処理
router.post('/delete', authenticationEnsurer, (req, res, next) => {
  console.log(req.body.memoId);
  Memo.findByPk(req.body.memoId)
    .then(memo => {
      memo.destroy();
    })
    .then(() => {
      res.redirect('/'); //トップ画面に転送
    });
});

//登録処理
router.post('/', authenticationEnsurer, (req, res, next) => {
  const updatedAt = new Date();

  Memo.create({
    memoId: Memo.memoId, //id
    programName: req.body.programName.slice(0, 255) || '（番組名未設定）', //番組名
    personality:
      req.body.personality.slice(0, 255) || '（パーソナリティ未設定）', //パーソナリティ
    airtime: req.body.airtime.slice(0, 255) || '（放送時間未設定）', //放送時間
    impression: req.body.impression, //感想
    createdBy: req.user.id, //ユーザーid
    updatedAt: updatedAt,
  }).then(memo => {
    res.redirect('/'); //トップ画面に転送
  });
});

module.exports = router;
