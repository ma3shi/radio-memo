'use strict';
const request = require('supertest'); // Expressの Router オブジェクトをテストするモジュール
const app = require('../app'); //テストの対象となる app.js
const passportStub = require('passport-stub'); //GitHub 認証のログイン・ログアウト処理をテスト内で模倣

describe('/login', () => {
  //テストの前
  beforeAll(() => {
    passportStub.install(app); //passportStubをappオブジェクトにインストール
    passportStub.login({ username: 'testuser' }); //testuserというユーザー名のユーザーでログイン
  });
  //テストの後
  afterAll(() => {
    passportStub.logout(); //ログアウト
    passportStub.uninstall(app); //アンインストール
  });

  test('ログインのためのリンクが含まれる', () => {
    return request(app)
      .get('/login') // /loginにアクセス
      .expect('Content-Type', 'text/html; charset=utf-8') //レスポンスヘッダの 'Content-Type' が text/html; charset=utf-8であることをテスト
      .expect(/<a href="\/auth\/github"/) // <a href="/auth/github"がHTMLに含まれることをテスト
      .expect(200); // ステータスコードが200 OKであることをテスト
  });

  test('ログイン時はユーザー名が表示される', () => {
    return request(app)
      .get('/login') // /loginにアクセス
      .expect(/testuser/) //HTMLのbody内にtestuserという文字列が含まれることをテスト
      .expect(200);
  });
});

// /logout にアクセスした際に / にリダイレクトされる
describe('/logout', () => {
  test('/ にリダイレクトされる', () => {
    return request(app).get('/logout').expect('Location', '/').expect(302);
  });
});
