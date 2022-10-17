# DBマイグレーションについて

DBのマイグレーションには以下を使用します。

- [db-migrate](https://www.npmjs.com/package/db-migrate)

また、"longblob"など、特殊な型を利用するために、DB更新はSQL文を用います。


## 公式リファレンス:

- [Usage - db-migrate](https://db-migrate.readthedocs.io/en/latest/Getting%20Started/usage/)


## 使い方

### 接続先を .env ファイルに設定します。
```
DATABASE_URL=<driver>://<user>:<password>@<address>:<port>/<database>
```

### DBを初期化、最新にする
```
npx db-migrate up
```

### DBを消す
```
npx db-migrate down
```

### DBを全部消す(最初からやり直したい時など)
```
npx db-migrate reset
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
基本的に1ファイルにつき、1テーブルの変更を書きます。


## mysql関連メモ

### 欲しいテストケースをダンプする
```
mysqldump -h 127.0.0.1 -P3307 mavisualize testcases testcase_images --no-create-info -uroot -p --where="testcase_id=39" --hex-blob > sqls/sample_testcase.sql
```
※ sqlがバイナリデータを含んでおり、データの受け渡しでトラブルがあったので、'--hex-blob' を付けること。


### ダンプしたsqlを投入する
```
mysql -h 127.0.0.1 -P3307 mavisualize -uroot -p < sqls/sample_testcase.sql
```
