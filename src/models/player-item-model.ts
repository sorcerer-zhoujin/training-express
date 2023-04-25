import { PoolConnection } from "mysql2/promise";
import { PlayerItem } from "../interfaces/player-item";
import { RowDataPacket, OkPacket } from "mysql2";
import { NotFoundError } from "../interfaces/my-error";
import { Item } from "../interfaces/item";

const getItems = async (playerId: number, dbConnection: PoolConnection): Promise<PlayerItem[]> => {
  const [rows] = await dbConnection.query<RowDataPacket[]>(
    "SELECT * FROM `player_items` WHERE `player_id` = ?",
    [playerId]
  );

  const result: PlayerItem[] = rows.map((row) => {
    return {
      itemId: row.item_id,
      count: row.count
    };
  });
  return result;
}

const getItem = async (playerId: number, itemId: number, dbConnection: PoolConnection): Promise<PlayerItem | null> => {
  const [[row]] = await dbConnection.query<RowDataPacket[]>(
    "SELECT * FROM `player_items` WHERE `player_id` = ? AND `item_id` = ?",
    [playerId, itemId]
  );
  if (!row) return null;
  const result: PlayerItem = {
    playerId: row.player_id,
    itemId: row.item_id,
    count: row.count
  };
  return result;
}

const insertItem = async (
  data: PlayerItem,
  dbConnection: PoolConnection
): Promise<PlayerItem> => {
  const [rows] = await dbConnection.query<RowDataPacket[]>(
    "INSERT INTO `player_items` (`player_id`, `item_id`, `count`) VALUES (?,?,?)",
    [data.playerId, data.itemId, data.count]
  );

  const result: PlayerItem = {
    itemId: data.itemId,
    count: data.count
  }

  return result;
}

const updateItem = async (
  data: PlayerItem,
  dbConnection: PoolConnection
): Promise<PlayerItem> => {
  const [rows] = await dbConnection.query<RowDataPacket[]>(
    "UPDATE `player_items` SET `count` = ? WHERE `player_id` = ? AND `item_id` = ?",
    [data.count, data.playerId, data.itemId]
  );

  const result: PlayerItem = {
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

// データベースからアイテム情報を取得
const getItemData = async (
  id: number,
  dbConnection: PoolConnection
): Promise<Item> => {
  const [[row]] = await dbConnection.query<RowDataPacket[]>(
    "SELECT * FROM `items` WHERE `id` = ?",
    [id]
  );
  if (!row) throw new NotFoundError("Player or item data not found.");

  const item: Item = {
    id: row.id,
    name: row.name,
    heal: row.heal,
    price: row.price
  };

  return item;
}

export { getItems, getItem, insertItem, updateItem, doDataCheck, getItemData }
