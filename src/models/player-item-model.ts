import { PoolConnection } from "mysql2/promise";
import { PlayerItem, PlayerItemJson } from "../interfaces/player-item";
import { RowDataPacket, OkPacket } from "mysql2";
import { NotFoundError } from "../interfaces/my-error";

const getItems = async (playerId: number, dbConnection: PoolConnection): Promise<PlayerItemJson[]> => {
  const [rows] = await dbConnection.query<RowDataPacket[]>(
    "SELECT * FROM `player_items` WHERE `player_id` = ?",
    [playerId]
  );

  const result: PlayerItemJson[] = rows.map((row) => {
    return {
      itemId: row.item_id,
      count: row.count
    };
  });
  return result;
}

const getItem = async (playerId: number, itemId: number, dbConnection: PoolConnection): Promise<PlayerItemJson | null> => {
  const [[row]] = await dbConnection.query<RowDataPacket[]>(
    "SELECT * FROM `player_items` WHERE `player_id` = ? AND `item_id` = ?",
    [playerId, itemId]
  );
  if (!row) return null;
  const result: PlayerItemJson = {
    itemId: row.item_id,
    count: row.count
  };
  return result;
}

const insertItem = async (
  data: PlayerItem,
  dbConnection: PoolConnection
): Promise<PlayerItemJson> => {
  const [rows] = await dbConnection.query<RowDataPacket[]>(
    "INSERT INTO `player_items` (`player_id`, `item_id`, `count`) VALUES (?,?,?)",
    [data.playerId, data.itemId, data.count]
  );

  const result: PlayerItemJson = {
    itemId: data.itemId,
    count: data.count
  }

  return result;
}

const updateItem = async (
  data: PlayerItem,
  dbConnection: PoolConnection
): Promise<PlayerItemJson> => {
  const [rows] = await dbConnection.query<RowDataPacket[]>(
    "UPDATE `player_items` SET `count` = ? WHERE `player_id` = ? AND `item_id` = ?",
    [data.count, data.playerId, data.itemId]
  );

  const result: PlayerItemJson = {
    itemId: data.itemId,
    count: data.count
  }

  return result;
}

// データを確保する関数
const doDataCheck = async (
  data: PlayerItem,
  dbConnection: PoolConnection
): Promise<void> => {
  const [[row]] = await dbConnection.query<RowDataPacket[]>(
    "SELECT * FROM `players` JOIN `items` ON `players`.`id` = ? AND `items`.`id` = ?",
    [data.playerId, data.itemId]
  );
  if (!row) throw new NotFoundError("Player or item data not found.");
}


export { getItems, getItem, insertItem, updateItem, doDataCheck }
