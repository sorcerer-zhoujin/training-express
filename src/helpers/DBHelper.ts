import mysql from "mysql2";
import fs from "fs";

const path = process.cwd() + "/config/mysql.json";
const config = JSON.parse(fs.readFileSync(path, "utf8"));
const db_connection = mysql.createConnection({
  host: config.host,
  user: config.user,
  database: config.database,
  password: config.password,
});

export { db_connection };
