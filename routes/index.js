var express = require('express'); //Expressモジュールを読み込む
var router = express.Router(); //Routerオブジェクトを呼び出す

/* GET home page. */
//nextを実行すると次のハンドラ(逐次処理を行っていく関数)が実行される
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router; // Routerオブジェクト自身をモジュールとして提供
