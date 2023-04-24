import * as playerItemModel from "../models/player-item-model";
import { PlayerItem, PlayerItemJson } from "../interfaces/player-item";
import { PoolConnection } from "mysql2/promise";

const getAllItems = async (playerId: number, dbConnection: PoolConnection): Promise<PlayerItemJson[]> => {
  const result = await playerItemModel.getItems(playerId, dbConnection);
  return result;
}

const getItem = async (playerId: number, itemId: number, dbConnection: PoolConnection): Promise<PlayerItemJson | null> => {
  const result = await playerItemModel.getItem(playerId, itemId, dbConnection)
  return result;
}

const addItem = async (
  data: PlayerItem,
  dbConnection: PoolConnection
): Promise<PlayerItemJson> => {
  // データをチェック
  await playerItemModel.doDataCheck(data, dbConnection);

  //const _items = await getItems(data.player_id!, dbConnection);
  //const item = _items.find(item => item.itemId === data.item_id);
  const item = await getItem(data.playerId!, data.itemId!, dbConnection);
  let result: PlayerItemJson;
  if (item) {
    // 加算
    data.count! += item.count!;
    // アップデート
    result = await playerItemModel.updateItem(data, dbConnection);
  }
  else {
    // インサート
    result = await playerItemModel.insertItem(data, dbConnection);
  }

  return result;
}

export { getAllItems, addItem }
