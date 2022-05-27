import { json } from "node:stream/consumers";
import { db_pool } from "../helpers/DBHelper";
import { User } from "../interfaces/User";

const getAllUsers = async () => {
  const [rows, fields] = await db_pool
    .promise()
    .query("SELECT * FROM `users`;");
  return rows;
};

const createUser = async (data: any[]) => {
  const [rows, fields] = await db_pool
    .promise()
    .query(
      "INSERT INTO `users` (`name`, `password`, `money`, `hp`) VALUES (?,?,?,?)",
      data
    );

  return (rows as any).insertId;
};

export { getAllUsers, createUser };
