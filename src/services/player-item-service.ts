import * as itemModel from "../models/item-model";
import * as playerItemModel from "../models/player-item-model";
import * as playerModel from "../models/player-model";
import { PlayerAndItem, PlayerItem } from "../interfaces/player-item";
import { Item } from "../interfaces/item";
import { Player } from "../interfaces/player";
import { PoolConnection } from "mysql2/promise";
import { getPlayerById } from "./player-service";
import { LimitExceededError, NotEnoughError } from "../interfaces/my-error";
import { lottery } from "../helpers/lottery-helper";

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
): Promise<PlayerItem> => {
  // データをチェック
  await playerItemModel.doDataCheck(data, dbConnection);

  const item = await getItem(data.playerId!, data.itemId!, dbConnection);
  let result: PlayerItem;
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

const useGacha = async (
  playerId: number,
  count: number,
  dbConnection: PoolConnection
): Promise<PlayerItem[]> => {
  const COST = 10;
  const totalCost = COST * count;
  // プレイヤーデータ
  let player: Player = await getPlayerById(playerId, dbConnection);
  let playerItems: PlayerItem[] = await playerItemModel.getItems(playerId, dbConnection);
  if (player.money! < totalCost) {
    throw new NotEnoughError("The player doesn't have enough money.")
  } else {
    player.money! -= totalCost;
  }

  // アイテム情報
  const itemPool: Item[] = await itemModel.getAllItems(dbConnection);
  let lootPercent: number[] = [0];
  itemPool.forEach(item => {
    lootPercent[item.id!] = item.percent!;
  });

  const resultIds: number[] = lottery(lootPercent, count);
  let itemCounter: number[] = new Array(itemPool.length + 1).fill(0);
  // ガチャ結果アイテムの個数を計算
  resultIds.forEach(id => { itemCounter[id]++; });

  // 戻り値配列・PlayerItem[]
  const results: PlayerItem[] = [];

  for (const item of itemPool) {
    // 戻り値配列・PlayerItem[]
    results.push({
        itemId: item.id,
        count: itemCounter[item.id!]
      });
    // プレイヤーアイテム存在チェック
    const hasItem: boolean = playerItems.find(i => i.itemId === item.id) ? true : false;
    if (hasItem) {
      const newCount: number = itemCounter[item.id!] + playerItems.find(i => i.itemId === item.id)!.count!;
      const newData: PlayerItem = {
        playerId: playerId,
        itemId: item.id,
        count: newCount
      }
      await playerItemModel.updateItem(newData, dbConnection);
    } else {
      const newCount: number = itemCounter[item.id!];
      const newData: PlayerItem = {
        playerId: playerId,
        itemId: item.id,
        count: newCount
      }
      await playerItemModel.insertItem(newData, dbConnection);
    }
  }
  await playerModel.updatePlayer(playerId, player, dbConnection);

  return results;
}

export { getAllItems, addItem, useItem, useGacha }
