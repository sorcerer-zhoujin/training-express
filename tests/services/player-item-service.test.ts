import { getAllItems, addItem, useItem, useGacha } from "../../src/services/player-item-service";
import { Player } from "../../src/interfaces/player";
import { PlayerItem } from "../../src/interfaces/player-item";
import { Item } from "../../src/interfaces/item";
import * as playerModel from "../../src/models/player-model";
import * as playerItemModel from "../../src/models/player-item-model";
import * as itemModel from "../../src/models/item-model";
import * as lotteryHelper from "../../src/helpers/lottery-helper";
import { NotEnoughError, LimitExceededError } from "../../src/interfaces/my-error";

describe("get data tests", () => {
  const mockPlayerItem1: PlayerItem = {
    playerId: 1,
    itemId: 1,
    count: 10
  };
  const mockPlayerItem2: PlayerItem = {
  playerId: 1,
  itemId: 2,
  count: 20
  };
  const mockPlayerAllItems: PlayerItem[] = [mockPlayerItem1, mockPlayerItem2];
  const mockPlayerAllItemsEmpty: PlayerItem[] = [];

  test("get all items from a player", async () => {
    jest.spyOn(playerItemModel, "getItems")
        .mockResolvedValueOnce(mockPlayerAllItems)
        .mockResolvedValueOnce(mockPlayerAllItemsEmpty);

    let id: any, conn: any;
    expect(await getAllItems(id, conn)).toEqual(mockPlayerAllItems);
    expect(await getAllItems(id, conn)).toEqual(mockPlayerAllItemsEmpty);
  });
});

describe("add item tests", () => {
  const mockPlayerItem: PlayerItem = {
    playerId: 1,
    itemId: 1,
    count: 10
  };
  // 乱数を生成
  const randomCount1 = Math.floor(Math.random() * 100) + 1;
  const randomCount2 = Math.floor(Math.random() * 100) + 1;

  test("update", async () => {
    const mockItemReq: PlayerItem = {
      playerId: mockPlayerItem.playerId,
      itemId: mockPlayerItem.itemId,
      count: randomCount1
    }
    const mockItemRes: PlayerItem = {
      itemId: mockPlayerItem.itemId,
      count: mockPlayerItem.count! + randomCount1
    };
    // データをチェックのモック関数
    jest.spyOn(playerItemModel, "doDataCheck")
        .mockResolvedValueOnce()
    // getItemのモック関数
    jest.spyOn(playerItemModel, "getItem")
        .mockResolvedValueOnce(mockPlayerItem)
    // アップデートのモック関数
    jest.spyOn(playerItemModel, "updateItem")
        .mockResolvedValueOnce(mockItemRes);

    let conn: any;
    expect(await addItem(mockItemReq, conn)).toEqual(mockItemRes);
  });

  test("insert", async () => {
    const mockReq: PlayerItem = {
      playerId: 2,
      itemId: 1,
      count: randomCount2
    }
    const mockRes: PlayerItem = {
      itemId: mockReq.itemId,
      count: randomCount2
    };
    // データをチェックのモック関数
    jest.spyOn(playerItemModel, "doDataCheck")
        .mockResolvedValueOnce();
    // getItemのモック関数
    jest.spyOn(playerItemModel, "getItem")
        .mockResolvedValueOnce(null);
    // インサートのモック関数
    jest.spyOn(playerItemModel, "insertItem")
        .mockResolvedValueOnce(mockRes);

    let conn: any;
    expect(await addItem(mockReq, conn)).toEqual(mockRes);
  });
});

describe("use item tests", () => {
  const mockPlayer: Player = {
    id: 1,
    name: "Player",
    money: 100,
    hp: 100,
    mp: 100
  }
  const mockItem1: Item = {
    id: 1,
    name: "HP Item",
    heal: 1,
    price: 10
  };
  const mockItem2: Item = {
    id: 2,
    name: "MP Item",
    heal: 1,
    price: 10
  };
  const mockPlayerItem1: PlayerItem = {
    playerId: 1,
    itemId: 1,
    count: 10
  };
  const mockPlayerItem2: PlayerItem = {
    playerId: 1,
    itemId: 2,
    count: 5
  };

  // DBアクセス関数をモック関数に書き換え
  jest.spyOn(playerItemModel, "doDataCheck").mockReset().mockImplementation();
  jest.spyOn(playerItemModel, "updateItem").mockReset().mockImplementation();
  jest.spyOn(playerModel, "updatePlayer").mockReset().mockImplementation();

  test("update", async () => {
    const getPlayerByIdSpy = jest.spyOn(playerModel, "getPlayerById").mockReset()
      .mockResolvedValue({ ...mockPlayer });
    const getItemSpy = jest.spyOn(playerItemModel, "getItem").mockReset()
      .mockResolvedValueOnce({ ...mockPlayerItem1 })
      .mockResolvedValueOnce({ ...mockPlayerItem2 });
    const getItemDataSpy = jest.spyOn(playerItemModel, "getItemData").mockReset()
      .mockResolvedValueOnce({ ...mockItem1 })
      .mockResolvedValueOnce({ ...mockItem2 });

    let conn: any;
    // HP+
    let result = await useItem({
      playerId: mockPlayer.id,
      itemId: mockItem1.id,
      count: 3
    }, conn);
    // 値変更チェック
    expect(result.player.hp).toBe(mockPlayer.hp! + mockItem1.heal! * 3);
    expect(result.playerItem.count).toBe(mockPlayerItem1.count! - 3);

    // MP+
    result = await useItem({
      playerId: mockPlayer.id,
      itemId: mockItem2.id,
      count: 3
    }, conn);
    // 値変更チェック
    expect(result.player.mp).toBe(mockPlayer.mp! + mockItem2.heal! * 3);
    expect(result.playerItem.count).toBe(mockPlayerItem2.count! - 3);
  });

  test("errors", async () => {
    const getPlayerByIdSpy = jest.spyOn(playerModel, "getPlayerById").mockReset()
      .mockResolvedValue({
        id: 1,
        name: "Player Without Money",
        money: 0,
        hp: 100,
        mp: 100
      })
      .mockResolvedValue({
        id: 1,
        name: "Player At Max Value",
        money: 100,
        hp: 200,
        mp: 200
      });
    const getItemSpy = jest.spyOn(playerItemModel, "getItem").mockReset()
      .mockResolvedValueOnce({ ...mockPlayerItem1 })
      .mockResolvedValueOnce({ ...mockPlayerItem1 });
    const getItemDataSpy = jest.spyOn(playerItemModel, "getItemData").mockReset()
      .mockResolvedValueOnce({ ...mockItem1 })
      .mockResolvedValueOnce({ ...mockItem1 });

    let data: any, conn: any;
    // Errors
    await expect(useItem({
      playerId: mockPlayer.id,
      itemId: mockItem1.id,
      count: 1000
    }, conn)).rejects.toThrowError(NotEnoughError);

    await expect(useItem({
      playerId: mockPlayer.id,
      itemId: mockItem1.id,
      count: 1
    }, conn)).rejects.toThrowError(LimitExceededError);
  });
});

describe("gacha tests", () => {
  const mockItem1: Item = {
    id: 1,
    name: "HP Item",
    heal: 10,
    price: 1,
    percent: 30
  };
  const mockItem2: Item = {
    id: 2,
    name: "MP Item",
    heal: 10,
    price: 1,
    percent: 50
  };
  const mockPlayerItem1: PlayerItem = {
    playerId: 1,
    itemId: 1,
    count: 1
  };
  const mockPlayerItem2: PlayerItem = {
    playerId: 1,
    itemId: 2,
    count: 1
  };

  // DBアクセス関数をモック関数に書き換え
  jest.spyOn(playerItemModel, "updateItem").mockReset().mockImplementation();
  jest.spyOn(playerItemModel, "insertItem").mockReset().mockImplementation();
  jest.spyOn(playerModel, "updatePlayer").mockReset().mockImplementation();

  test("lottery function and result check", async () => {
    const getPlayerByIdSpy = jest.spyOn(playerModel, "getPlayerById").mockReset()
      .mockResolvedValue({
        id: 1,
        money: 100000
      });
    const getItemsSpy = jest.spyOn(playerItemModel, "getItems").mockReset()
      .mockResolvedValue([mockPlayerItem1, mockPlayerItem2]);
    const getAllItemsSpy = jest.spyOn(itemModel, "getAllItems").mockReset()
      .mockResolvedValue([mockItem1, mockItem2]);

    // 抽選ロジックのモック関数
    const lotterySpy = jest.spyOn(lotteryHelper, "lottery").mockReset()
      .mockReturnValue([ 0, 1, 2, 2, 1, 1, 2, 0, 0 ,2]);

    let pid: any, cnt: any, conn: any;
    const result = await useGacha(pid, cnt, conn);

    expect(lotterySpy).toHaveBeenCalled();
    expect(result).toEqual([
      { itemId: 1, count: 3 },
      { itemId: 2 ,count: 4 }
    ]);
  });
});
