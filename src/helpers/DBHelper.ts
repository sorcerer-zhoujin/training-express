import mysql from "mysql2";
import fs from "fs";

//const path = process.cwd() + "/config/mysql.json";
//const config = JSON.parse(fs.readFileSync(path, "utf8"));

const db_connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASS,
}); //同期

const db_pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASS,
  waitForConnections: true,
  connectionLimit: Number(process.env.CONNECTION_LIMIT),
  queueLimit: Number(process.env.QUEUE_LIMIT),
}).promise();

class DB {
  private static instance: DB;
  private static db_pool: mysql.Pool;
  private constructor() {
    DB.db_pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      database: process.env.DB_DATABASE,
      password: process.env.DB_PASS,
      waitForConnections: true,
      connectionLimit: Number(process.env.CONNECTION_LIMIT),
      queueLimit: Number(process.env.QUEUE_LIMIT),
    });
  }
  static getInstance() {
    if (!DB.instance) {
      DB.instance = new DB();
    }
    return DB.instance;
  }
  pool() {
    return DB.db_pool;
  }

  pool_promise() {
    return DB.db_pool.promise();
  }
}

export { db_connection, db_pool };
