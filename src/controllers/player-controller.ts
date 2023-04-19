import { Response, Request, NextFunction } from "express";
import * as playerService from "../services/player-service";
import { dbPool, transactionHelper } from "../helpers/db-helper";
import { Player } from "../interfaces/player";

export class PlayerController {
  async getAllPlayers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const dbConnection = await dbPool.getConnection();
    const result = await playerService.getAllPlayers(dbConnection);

    res.status(200);
    res.json(result);
  }

  async getPlayerById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const playerId: number  = parseInt(req.params.playerId, 10);
    if (isNaN(playerId))
    {
      res.status(400).json({ message: "Invalid parameters or body." });
      return;
    }
    const dbConnection = await dbPool.getConnection();
    const result = await playerService.getPlayerById(playerId, dbConnection);

    res.status(200);
    res.json(result);
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
      // トランザクション
      await transactionHelper(dbConnection, async () => {
        result = await playerService.createPlayer(player, dbConnection);
      });
      res.status(200).json({ id: result! });
    } catch (e) {
      next(e);
    }
  }

  async updatePlayer(
    req: Request,
    res: Response,
    next:NextFunction
  ): Promise<void> {
    const playerId: number  = parseInt(req.params.playerId, 10);
    if (isNaN(playerId) || !req.body || Object.keys(req.body).length === 0) {
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
      let result: Player;
      // トランザクション
      await transactionHelper(dbConnection, async () => {
        result = await playerService.updatePlayer(playerId, player, dbConnection);
      });
      res.status(200).json(result!);
    } catch (e) {
      next(e);
    }
  }

  async deletePlayer(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const playerId: number  = parseInt(req.params.playerId, 10);
    if (isNaN(playerId))
    {
      res.status(400).json({ message: "Invalid parameters or body." });
      return;
    }
    const dbConnection = await dbPool.getConnection();
    try {
      let result: number;
      // トランザクション
      await transactionHelper(dbConnection, async () => {
        result = await playerService.deletePlayer(playerId, dbConnection);
      });
      res.status(200).json(result!);
    } catch (e) {
      next(e);
    }
    // const result = await playerService.deletePlayer(playerId, dbConnection);

    // res.status(200);
    // res.json(result);
  }

  /**
   * next(err)を投げるとapp.tsでエラーハンドリングできます。
   * https://expressjs.com/ja/guide/error-handling.html
   */
  errorResponse(req: Request, res: Response, next: NextFunction) {
    next(new Error("エラー発生"));
  }
}
