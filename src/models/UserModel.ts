import { db_pool } from "../helpers/DBHelper";

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

const getUser = async (id: number) => {
  const [rows, fields] = await db_pool
    .promise()
    .query("SELECT * FROM `users` WHERE `id` = ?", id);
  return rows;
};

const updateUser = async (data: any[]) => {
  const [rows, fields] = await db_pool
    .promise()
    .query(
      "UPDATE `users` SET `name`=?, `password`=?, `money`=?, `hp`=? WHERE `id` = ?",
      data
    );

  console.log(rows);
  return rows as any;
};

export { getAllUsers, createUser, getUser, updateUser };
