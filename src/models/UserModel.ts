import { db_pool } from "../helpers/DBHelper";

const getAllUsers = async () => {
  const [rows, fields] = await db_pool
    .promise()
    .query("SELECT * FROM `users`;");
  return rows as any;
};

const createUser = async (data: any[]) => {
  const [rows, fields] = await db_pool
    .promise()
    .query(
      "INSERT INTO `users` (`name`, `password`, `money`, `hp`) VALUES (?,?,?,?)",
      data
    );

  return (rows as any).insertId as number;
};

const getUser = async (id: number) => {
  const [rows, fields] = await db_pool
    .promise()
    .query("SELECT * FROM `users` WHERE `id` = ?", id);
  return (rows as any)[0];
};

const updateUser = async (data: any[]) => {
  const [rows, fields] = await db_pool
    .promise()
    .query(
      "UPDATE `users` SET `name`=?, `password`=?, `money`=?, `hp`=? WHERE `id` = ?",
      data
    );

  return (rows as any).affectedRows != 0 ? true : false;
};

export { getAllUsers, createUser, getUser, updateUser };
