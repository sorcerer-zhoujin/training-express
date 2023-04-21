import { Response, Request, NextFunction } from "express";
import * as playerItemService from "../services/player-item-service";
import { dbPool, transactionHelper } from "../helpers/db-helper";
import { PlayerItem, PlayerItemJson } from "../interfaces/player-item";
import { NotFoundError } from "../interfaces/my-error";

export class PlayerItemController {
  async getItems(
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
      const result = await playerItemService.getItems(pid, dbConnection);
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
    const pid: number  = parseInt(req.params.playerId, 10);
    if (isNaN(pid) ||
        !req.body.itemId ||
        !req.body.count
    ) {
      res.status(400).json({ message: "Invalid parameters or body." });
    }

    const dbConnection = await dbPool.getConnection();

    try {
      const _data = await playerItemService.getItems(pid, dbConnection);
      //const hasItem = _data.some((i) => i.item_id === req.body.itemId);
      const item = _data.find(item => item.itemId === req.body.itemId);

      let data: PlayerItem = {
        player_id: pid,
        item_id: req.body.itemId,
        count: req.body.count
      };
      let result: PlayerItemJson;

      if (item) {
        // 加算
        data.count! += item.count!;
        // トランザクション
        await transactionHelper(dbConnection, async () => {
          result = await playerItemService.updateItem(data, dbConnection);
        });
      } else {
        // トランザクション
        await transactionHelper(dbConnection, async () => {
          result = await playerItemService.insertItem(data, dbConnection);
        });
      }
      res.status(200).json(result!);
    } catch (e) {
      if (e instanceof NotFoundError) {
        res.status(404).json({message: e.message });
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
