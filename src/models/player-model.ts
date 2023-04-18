import { PoolConnection } from "mysql2/promise";
import { Player } from "../interfaces/player";
import { RowDataPacket, OkPacket } from "mysql2";

const getAllPlayers = async (dbConnection: PoolConnection): Promise<Player[]> => {
  const [rows] = await dbConnection.query<RowDataPacket[]>(
    "SELECT * FROM `players`;"
  );

  const result: Player[] = rows.map((row) => {
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

const createPlayer = async (
  data: Player,
  dbConnection: PoolConnection
): Promise<number> => {
  const [rows] = await dbConnection.query<OkPacket>(
    "INSERT INTO `players` (`name`, `password`, `money`, `hp`) VALUES (?,?,?,?)",
    [data.name, data.password, data.money, data.hp]
  );

  return rows.insertId;
};

export { getAllPlayers, createPlayer };
