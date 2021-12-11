'use strict';

function ensure(req, res, next) {
  //認証をチェック
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login'); //認証されていない場合は /loginにリダイレクト
}

module.exports = ensure; //モジュールとして提供
