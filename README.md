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

## TODO

- ユニットテスト

## 2022/05/23 project update

### package.json 内の package 更新

```bash
# install npm-check-updates
npm install -g npm-check-updates
cd path/to/project
ncu
ncu -u
npm install
```

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

## mysql2

https://www.npmjs.com/package/mysql2

- 設定ファイル:
  - /config/mysql.json
- 関数化
  - /src/helpers/DBHelper.ts

使用例:

```ts
import { db_connection } from "../helpers/DBHelper";

let results;
db_connection.query(
  "SELECT COUNT(*) FROM `tweets`;",
  (err, results, fields) => {
    results = results;
  }
);
```

## ユニットテスト--jest

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

4. test ファイルは`src/tests`に置く

テスト例:

math.ts

```ts
const add = (a: number, b: number) => {
  return a + b;
};

export { add };
```

math.test.ts

```ts
import { add } from "./math";

test("add", () => {
  expect(add(1, 2)).toBe(3);
});
```

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
