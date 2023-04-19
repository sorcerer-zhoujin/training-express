import { PoolConnection } from "mysql2/promise";
import { Player } from "../interfaces/player";
import { RowDataPacket, OkPacket } from "mysql2";

const getAllPlayers = async (dbConnection: PoolConnection): Promise<Player[]> => {
  const [rows] = await dbConnection.query<RowDataPacket[]>(
    "SELECT * FROM `players`"
  );

  const result: Player[] = rows.map((row) => {
    return {
      id: row.id,
      name: row.name,
      money: row.money,
      hp: row.hp,
      mp: row.mp
    };
  });
  return result;
};

const getPlayerById = async (playerId: number, dbConnection: PoolConnection): Promise<Player> => {
  const [[row]] = await dbConnection.query<RowDataPacket[]>(
    "SELECT * FROM `players` WHERE `id` = ?",
    [playerId]
  );

  const result: Player = {
      id: row.id,
      name: row.name,
      money: row.money,
      hp: row.hp,
      mp: row.mp
    };

  return result;
}

const createPlayer = async (
  data: Player,
  dbConnection: PoolConnection
): Promise<number> => {
  const [rows] = await dbConnection.query<OkPacket>(
    "INSERT INTO `players` (`name`, `money`, `hp`, `mp`) VALUES (?,?,?,?)",
    [data.name, data.money, data.hp, data.mp]
  );

  return rows.insertId;
};

const updatePlayer = async (
  playerId: number,
  data: Player,
  dbConnection: PoolConnection
  ): Promise<Player> => {
  const [[row]] = await dbConnection.query<RowDataPacket[]>(
    "SELECT * FROM `players` WHERE `id` = ?",
    [playerId]
  );

  const value: Player = {
      id: playerId,
      name: data.name != null ? data.name : row.name,
      money: data.money != null ? data.money : row.money,
      hp: data.hp != null ? data.hp : row.hp,
      mp: data.hp != null ? data.hp : row.hp
  };

  await dbConnection.query<OkPacket>(
    "UPDATE `players` SET `name` = ?, `money` = ?, `hp` = ?, `mp` = ? WHERE `id` = ?",
    [value.name, value.money, value.hp, value.mp, value.id]
  );

  return value;
}

export { getAllPlayers, getPlayerById, createPlayer, updatePlayer };
