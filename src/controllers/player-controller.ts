import { Response, Request, NextFunction } from "express";
import { getAllPlayers, createPlayer } from "../services/player-service";
import { dbPool, transactionHelper } from "../helpers/db-helper";
import { Player } from "../interfaces/player";

export class PlayerController {
  async getAllPlayers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const dbConnection = await dbPool.getConnection();
    try {
      await dbConnection.beginTransaction(); // トランザクション例
      const result = await getAllPlayers(dbConnection);

      await dbConnection.commit();
      res.status(200);
      res.json(result);
    } catch (e) {
      await dbConnection.rollback();
      next(e);
    } finally {
      dbConnection.release(); // connectionを返却
    }
  }

  async createPlayer(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    if (
      !req.body.name ||
      !req.body.money ||
      !req.body.hp ||
      !req.body.mp
    ) {
      res.status(400).json({ message: "Invalid parameters or body." });
      return;
    }

    const player: Player = {
      name: req.body.name,
      money: req.body.money,
      hp: req.body.hp,
      mp: req.body.mp
    };

    const dbConnection = await dbPool.getConnection();
    try {
      let result: number;
      // トランザクション例2
      await transactionHelper(dbConnection, async () => {
        result = await createPlayer(player, dbConnection);
      });
      res.status(200).json({ id: result! });
    } catch (e) {
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
