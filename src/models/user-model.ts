import { PoolConnection } from "mysql2/promise";
import { User } from "../interfaces/user";
import { RowDataPacket, OkPacket } from "mysql2";

const getAllUsers = async (dbConnection: PoolConnection): Promise<User[]> => {
  const [rows] = await dbConnection.query<RowDataPacket[]>(
    "SELECT * FROM `users`;"
  );

  const result: User[] = rows.map((row) => {
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

const createUser = async (
  data: User,
  dbConnection: PoolConnection
): Promise<number> => {
  const [rows] = await dbConnection.query<OkPacket>(
    "INSERT INTO `users` (`name`, `password`, `money`, `hp`) VALUES (?,?,?,?)",
    [data.name, data.password, data.money, data.hp]
  );

  return rows.insertId;
};

export { getAllUsers, createUser };
