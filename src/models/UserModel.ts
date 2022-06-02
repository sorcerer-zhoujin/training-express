import { db_pool } from "../helpers/DBHelper";
import { User } from "../interfaces/User";
import { RowDataPacket, OkPacket } from "mysql2";
import { NotFoundError } from "../interfaces/my-error";

const getAllUsers = async (): Promise<User[]> => {
  const [rows] = await db_pool.promise().query("SELECT * FROM `users`;");

  const result: User[] = (rows as any).map((row: User) => {
    return {
      id: row.id,
      name: row.name,
      password: row.password,
      money: row.money,
      hp: row.hp,
    };
  });
  return result;
};

const createUser = async (data: User): Promise<number> => {
  const [rows] = await db_pool
    .promise()
    .query(
      "INSERT INTO `users` (`name`, `password`, `money`, `hp`) VALUES (?,?,?,?)",
      [data.name, data.password, data.money, data.hp]
    );

  return (rows as OkPacket).insertId;
};

const getUser = async (id: number): Promise<User> => {
  const [rows] = await db_pool
    .promise()
    .query("SELECT * FROM `users` WHERE `id` = ?", id);

  if ((rows as any)[0]) return (rows as any)[0];
  else throw new NotFoundError();
};

const updateUser = async (data: User): Promise<boolean> => {
  const [rows] = await db_pool
    .promise()
    .query(
      "UPDATE `users` SET `name`=?, `password`=?, `money`=?, `hp`=? WHERE `id` = ?",
      [data.name, data.password, data.money, data.hp, data.id]
    );

  return (rows as any).affectedRows != 0;
};

export { getAllUsers, createUser, getUser, updateUser };
