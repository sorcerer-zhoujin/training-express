import * as playerItemModel from "../models/player-item-model";
import * as playerModel from "../models/player-model";
import { PlayerAndItem, PlayerItem, PlayerItemJson } from "../interfaces/player-item";
import { PoolConnection } from "mysql2/promise";
import { getPlayerById } from "./player-service";
import { LimitExceededError, NotEnoughError } from "../interfaces/my-error";

const getAllItems = async (playerId: number, dbConnection: PoolConnection): Promise<PlayerItem[]> => {
  const result = await playerItemModel.getItems(playerId, dbConnection);
  return result;
}

const getItem = async (playerId: number, itemId: number, dbConnection: PoolConnection): Promise<PlayerItem | null> => {
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

const useItem = async (
  data: PlayerItem,
  dbConnection: PoolConnection
): Promise<PlayerAndItem> => {
  // データをチェック
  await playerItemModel.doDataCheck(data, dbConnection);

  const MAX_HP = 200,
        MAX_MP = 200;

  let player = await getPlayerById(data.playerId!, dbConnection);
  let item = (await getItem(data.playerId!, data.itemId!, dbConnection))!;
  const itemValue = (await playerItemModel.getItemData(data.itemId!, dbConnection)).heal;

  // アイテム不足
  if (item.count! < data.count!) {
    throw new NotEnoughError("The player doesn't have enough items.");
  }

  // HP/MP MAX
  if (player.hp! >= MAX_HP || player.mp! >= MAX_MP) {
    throw new LimitExceededError("The player has reached full HP/MP.");
  }

  // HP+
  if (item.itemId === 1) {
    for (let i = data.count!; i > 0; i--) {
      player.hp = (player.hp! + itemValue!) < MAX_HP ? (player.hp! + itemValue!) : MAX_HP;
      item.count!--;
      if (player!.hp! >= MAX_HP) break;
    }
  }
  // MP+
  if (item.itemId === 2) {
    for (let i = data.count!; i > 0; i--) {
      player.mp = (player.mp! + itemValue!) < MAX_MP ? (player.mp! + itemValue!) : MAX_MP;
      item.count!--;
      if (player.mp! >= MAX_MP) break;
    }
  }

  // データ更新処理
  await playerItemModel.updateItem(item, dbConnection);
  await playerModel.updatePlayer(player.id!, player, dbConnection);

  const result: PlayerAndItem = {
    player: player!,
    playerItem: item!
  }
  return result;
}

export { getAllItems, addItem, useItem }
