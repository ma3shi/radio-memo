'use strict';

var createError = require('http-errors'); //HTTPのエラーを作成するモジュール
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser'); //Cookieを解釈するモジュール
var logger = require('morgan'); //コンソールにログを整形して出力するモジュール
var helmet = require('helmet'); //Expressフレームワークのデフォルトでは危険な挙動をセキュリティ上の問題のないものに変更するモジュール

const github_token = require('./github_token'); //GitHubへの登録時に作ったトークン

var session = require('express-session'); //認証した結果をセッション情報として維持できるモジュール
var passport = require('passport'); //様々なWebサービスとの外部認証を組み込むためのプラットフォームとなるモジュール

// モデルの読み込み
var User = require('./models/user');
var Memo = require('./models/memo');
//Userに対応するテーブルの作成
User.sync().then(() => {
  Memo.belongsTo(User, { foreignKey: 'createdBy' }); //メモがユーザーの従属エンティティであり、MemoにおけるcreatedByがUserの外部キーとなることを設定
  Memo.sync(); //Memoに対応するテーブルを作成
});

var passport_github2 = require('passport-github2'); //passportがGitHubのOAuth2.0認証を利用するためのモジュール
var GitHubStrategy = passport_github2.Strategy; //passport-github2モジュールからStrategyオブジェクトを取得

var GITHUB_CLIENT_ID = github_token.github_client_id; //GitHubへの登録時に作ったClientID
var GITHUB_CLIENT_SECRET = github_token.github_client_secret; //GitHubへの登録時に作ったClient Secret

//認証されたユーザー情報をデータとして保存
passport.serializeUser(function (user, done) {
  //done関数は、第一引数にエラー第二引数には結果をそれぞれ含めて実行
  done(null, user);
});

//保存されたデータをユーザーの情報として読み出す際の処理
passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

//https://github.com/cfsghost/passport-github/blob/master/README.mdではprocess.nextTickを使用していない→process.nextTick関数を利用せずここに処理を書いた場合,外部認証を使ったログインが多発した際に,Webサービスの機能が全く動かなくなってしまうという問題が発生する ←？？よくわからないので理解する必要あり
//passportモジュールにGitHubを利用した認証の戦略オブジェクトを設定
passport.use(
  new GitHubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: process.env.HEROKU_URL
        ? process.env.HEROKU_URL + 'auth/github/callback'
        : 'http://localhost:8000/auth/github/callback',
    },
    function (accessToken, refreshToken, profile, done) {
      //process.nextTickで登録する関数は処理に時間がかかるデータベースへの保存する処理を記載
      process.nextTick(function () {
        // Userモデルに対して、取得されたユーザーIDとユーザー名をUserのテーブルに保存
        User.upsert({
          userId: profile.id,
          username: profile.username,
        }).then(() => {
          done(null, profile);
        });
      });
    }
  )
);

//routesディレクトリの中にあるRouterオブジェクトのモジュールを読み込む
var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var logoutRouter = require('./routes/logout');
var memosRouter = require('./routes/memos');

var app = express(); //Applicationオブジェクトをexpressのモジュールを利用して作成し、appという変数に格納
app.use(helmet()); //appオブジェクトのuse関数(MiddlewareやRouterオブジェクトを登録するための関数)を使ってhelmetを使うように登録する。Middlewareとは、helmetのようなExpressの機能を拡張するモジュールのこと

// view engine setup
//Applicationオブジェクトのset関数を利用して、Applicationの設定を行う
app.set('views', path.join(__dirname, 'views')); //テンプレートのファイルがviewsディレクトリにあることを設定
app.set('view engine', 'pug'); //テンプレートエンジンがpugであることを設定

app.use(logger('dev')); //ログを出すためのloggerを使う設定
app.use(express.json()); //json形式を解釈したり作成するためのjsonを使う設定
app.use(express.urlencoded({ extended: false })); //URLをエンコードしたりデコードするための urlencoded を使う設定
app.use(cookieParser()); //Cookieを解釈したり作成するためのcookieParserを使う設定
app.use(express.static(path.join(__dirname, 'public'))); //静的なファイルをpublicというディレクトリにする

//express-sessionとpassportでセッションを利用するという設定
app.use(
  session({
    secret: 'bc07c5fca4c57e0c',
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter); // /というパスにアクセスされた時routes/index.jsで記述しているRouterオブジェクトを返す
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/memos', memosRouter);

//GitHubのOAuth2.0で認可される権限の範囲(スコープ)を user:email として、認証を行うように設定
//https://github.com/cfsghost/passport-github
app.get(
  '/auth/github',
  passport.authenticate('github', { scope: ['user:email'] }),
  function (req, res) {}
);

//GitHub が利用者の許可に対する問い合わせの結果を送るパスの /auth/github/callback のハンドラを登録
//https://github.com/cfsghost/passport-github
app.get(
  '/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }), //認証が失敗した際には、再度ログインを促す /login にリダイレクト
  function (req, res) {
    res.redirect('/'); //認証に成功していた場合は、  index.pugにリダイレクト
  }
);

// catch 404 and forward to error handler
// 存在しないパスへのアクセスがあった際の処理
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
// エラー処理
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error'); //views/error.pugというテンプレートを使ってエラーを表示させる
});

module.exports = app; //Applicationオブジェクトを,モジュールとして設定
