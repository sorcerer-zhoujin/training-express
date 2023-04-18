# express_template

WebAPI サーバーとして利用することを想定した Express のテンプレートです。

## 前準備

```
npm install
```

## サーバー起動

```
npm run dev
```

Typescript のコンパイルと Express の起動をします。

起動中、ソースコードを修正したら即座に反映されます。

## 動作確認

次のエンドポイントでレスポンスが返ります。

- GET localhost:3000
- GET localhost:3000/foo
- GET localhost:3000/foo/hoge
- POST localhost:3000/foo/hoge

上記以外はステータスコード 404 が返ります。

API の動作確認は Postman(https://www.postman.com)がお勧めです。

## ファイルストラクチャ

src ディレクトリ配下を実装すれば良いようになってます。

```
src
├── controllers # リクエストとレスポンスを処理します。実際のロジックはなるべくservicesに任せること。
├── helpers # 複数箇所で使い回すような、シンプルな便利関数を記述します
├── interfaces # Typescriptの型定義を記述します
├── middlewares # Expressnのミドルウェアを記述します。
├── routes # ルーティングを記述します
└── services # ビジネスロジックを記述します
```

## ログ

ログフレームワークに log4js を採用しています。

- https://www.npmjs.com/package/log4js

各種ファイルの場所はこちら。

- 出力先
  - log/
- 設定ファイル
  - config/log4js.json

このテンプレートでは次のサンプルをコピペして組み込みました。

- https://github.com/log4js-node/log4js-example

次のリクエストを投げると errors.log を出力できます。

- GET localhost:3000/errorSample

### エラー解決

```bash
[@types/express] Namespace 'serveStatic' has no exported member 'RequestHandlerConstructor'
```

というエラーが出た。https://github.com/DefinitelyTyped/DefinitelyTyped/issues/49595
解決方法:

```bash
npm update @types/express-serve-static-core --depth 2
npm update @types/serve-static --depth 2
```

## docker 起動

起動前に、前の docker container を閉じる

```bash
cd docker
docker-compose up -d
```

## DB マイグレーション

https://db-migrate.readthedocs.io/en/latest/Getting%20Started/installation/#installation

### 接続先を .env ファイルに設定します。

```
DATABASE_URL=<driver>://<user>:<password>@<address>:<port>/<database>
```

### DB を初期化、最新にする

```
npm run db-migrate-up
```

### DB を消す

```
npm run db-migrate-down
```

### DB を全部消す(最初からやり直したい時など)

```
npm run db-migrate-reset
```

### マイグレーションを作成する

```
npx db-migrate create add-people --sql-file
```

この時、以下の３つのファイルが作成されます。

```
./migrations/20111219120000-add-people.js
./migrations/sqls/20111219120000-add-people-up.sql
./migrations/sqls/20111219120000-add-people-down.sql
```

up にはバージョンアップに伴う変更を。
down にはバージョンダウンに伴う変更を記述します。
基本的に 1 ファイルにつき、1 テーブルの変更を書きます。

## 2022/05/23 project update についてメモ

### package.json 内の package 更新

```bash
# install npm-check-updates
npm install -g npm-check-updates
cd path/to/project
ncu
ncu -u
npm install
```

## 新しいプロジェクトにユニットテスト--jest を追加方法

jest を typescript で使うhttps://github.com/kulshekhar/ts-jest

1. install

```bash
npm install -D jest ts-jest @types/jest
```

2. packae.json 　スクリプトの追加

```json
  "scripts": {
		...
+    "test": "jest"
  },
```

3. config の設定

```bash
npx ts-jest config:init
```

`/jest.config.js` 生成された
テストファイルを指定する roots, プロジェクトの root は`<rootDir>`

```js
/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
};
```

4. test を実行
   `npm run test`を実行したら

```bash
 PASS  src/tests/add.test.ts
  √ add (2 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        4.115 s
Ran all test suites.
```
