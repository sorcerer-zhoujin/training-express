import * as playerItemModel from "../models/player-item-model";
import { PlayerItem, PlayerItemJson } from "../interfaces/player-item";
import { PoolConnection } from "mysql2/promise";

const getItems = async (playerId: number, dbConnection: PoolConnection): Promise<PlayerItemJson[]> => {
  const result = await playerItemModel.getItems(playerId, dbConnection);
  return result;
}


const insertItem = async (
  data: PlayerItem,
  dbConnection: PoolConnection
): Promise<PlayerItemJson> => {
  const result: PlayerItemJson = await playerItemModel.insertItem(data, dbConnection);
  return result;
}

const updateItem = async (
  data: PlayerItem,
  dbConnection: PoolConnection
): Promise<PlayerItemJson> => {
  const result: PlayerItemJson = await playerItemModel.updateItem(data, dbConnection);
  return result;
}

export { getItems, insertItem, updateItem }
