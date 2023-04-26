import { Response, Request, NextFunction } from "express";
import * as playerItemService from "../services/player-item-service";
import * as playerService from "../services/player-service";
import { dbPool, transactionHelper } from "../helpers/db-helper";
import { PlayerItem, PlayerAndItem } from "../interfaces/player-item";
import { LimitExceededError, NotEnoughError, NotFoundError } from "../interfaces/my-error";

export class PlayerItemController {
  async getAllItems(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const pid: number  = parseInt(req.params.playerId, 10);
    if (isNaN(pid))
    {
      res.status(400).json({ message: "Invalid parameters or body." });
    }
    const dbConnection = await dbPool.getConnection();

    try {
      const result = await playerItemService.getAllItems(pid, dbConnection);
      res.status(200).json(result);
    } catch (e) {
      if (e instanceof NotFoundError) {
        res.status(404).json({message: e.message });
      }
      next(e);
    }
  }

  async addItem(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const playerId: number  = parseInt(req.params.playerId, 10);
    if (isNaN(playerId) ||
        !req.body.itemId ||
        !req.body.count
    ) {
      res.status(400).json({ message: "Invalid parameters or body." });
    }

    const dbConnection = await dbPool.getConnection();

    try {
      const data: PlayerItem = {
        playerId: playerId,
        itemId: req.body.itemId,
        count: req.body.count
      };
      let result: PlayerItem;
      // トランザクション
      await transactionHelper(dbConnection, async () => {
        result = await playerItemService.addItem(data, dbConnection);
      });
      res.status(200).json(result!);
    } catch (e) {
      if (e instanceof NotFoundError) {
        res.status(404).json({message: e.message });
      }
      next(e);
    }
  }

  async useItem(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const playerId: number = parseInt(req.params.playerId, 10);
    if (isNaN(playerId) ||
        !req.body.itemId
    ) {
      res.status(400).json({ message: "Invalid parameters or body." });
    }

    const dbConnection = await dbPool.getConnection();

    try {
      let _result: PlayerAndItem;
      const data: PlayerItem = {
        playerId: playerId,
        itemId: req.body.itemId,
        count: req.body.count ? req.body.count : 1
      }
      // トランザクション
      await transactionHelper(dbConnection, async () => {
        _result = await playerItemService.useItem(data, dbConnection);
      });
      const result = {
        itemId: _result!.playerItem.itemId,
        count: _result!.playerItem.count,
        player: {
          id: _result!.player.id,
          hp: _result!.player.hp,
          mp: _result!.player.mp
        }
      };
      res.status(200).json(result);
    } catch (e) {
      if (e instanceof NotFoundError) {
        res.status(404).json({message: e.message });
      }
      if (e instanceof NotEnoughError ||
          e instanceof LimitExceededError) {
        res.status(400).json({message: e.message });
      }
      next(e);
    }
  }

  async useGacha(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const playerId: number = parseInt(req.params.playerId, 10);
    const gachaCount: number = parseInt(req.body.count, 10);
    if (isNaN(playerId) ||
        isNaN(gachaCount)
    ) {
      res.status(400).json({ message: "Invalid parameters or body." });
    }

    const dbConnection = await dbPool.getConnection();

    try {
      const gachaResults: PlayerItem[] = await playerItemService.useGacha(playerId, gachaCount, dbConnection);
      const player = await playerService.getPlayerById(playerId, dbConnection);
      const playerItems = await playerItemService.getAllItems(playerId, dbConnection);
      //console.log(gachaResult);
      const result = {
        results: gachaResults,
        player: {
          money: player.money,
          items: playerItems
        }
      };
      res.status(200).json(result);
    } catch (e) {
      if (e instanceof NotFoundError) {
        res.status(404).json({message: e.message });
      }
      if (e instanceof NotEnoughError ||
          e instanceof LimitExceededError) {
        res.status(400).json({message: e.message });
      }
      next(e);
    }
  }

  /**
   * next(err)を投げるとapp.tsでエラーハンドリングできます。
   * https://expressjs.com/ja/guide/error-handling.html
   */
  errorResponse(req: Request, res: Response, next: NextFunction) {
    next(new Error("エラー発生"));
  }
}
