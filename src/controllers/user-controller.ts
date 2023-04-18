import { Response, Request, NextFunction } from "express";
import { getAllUsers, createUser } from "../services/user-service";
import { dbPool, transactionHelper } from "../helpers/db-helper";
import { User } from "../interfaces/user";

export class UserController {
  async getAllUsers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const dbConnection = await dbPool.getConnection();
    try {
      await dbConnection.beginTransaction(); // トランザクション例
      const result = await getAllUsers(dbConnection);

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

  async createUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    if (
      !req.body.name ||
      !req.body.password ||
      !req.body.money ||
      !req.body.hp
    ) {
      res.status(400).json({ message: "Invalid parameters or body." });
      return;
    }

    const user: User = {
      name: req.body.name,
      password: req.body.password,
      money: req.body.money,
      hp: req.body.hp,
    };

    const dbConnection = await dbPool.getConnection();
    try {
      let result: number;
      // トランザクション例2
      await transactionHelper(dbConnection, async () => {
        result = await createUser(user, dbConnection);
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
