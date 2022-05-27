import { Response, Request, NextFunction } from "express";
import { getAllUsersSrv, createUserSrv } from "../services/UserService";

const log = require("log4js").getLogger("index");

export class UserController {
  async getAllUsers(req: Request, res: Response) {
    const result = await getAllUsersSrv();

    if (result.statusCode == 200) {
      res.status(200);
      res.json(result.data);
    } else if (result.statusCode == 500) {
      res.status(500);
      res.json(result.data);
    }
  }

  async createUser(req: Request, res: Response) {
    const result = await createUserSrv(req.body);

    if (result.statusCode == 200) {
      res.status(200);
      res.json(result.data);
    } else if (result.statusCode == 500) {
      res.status(500);
      res.json(result.data);
    }
  }

  async getUser(req: Request, res: Response) {
    res.json();
  }

  async updateUser(req: Request, res: Response) {
    res.json();
  }

  async buyItem(req: Request, res: Response) {
    res.json();
  }

  async useItem(req: Request, res: Response) {
    res.json();
  }

  /**
   * next(err)を投げるとapp.tsでエラーハンドリングできます。
   * https://expressjs.com/ja/guide/error-handling.html
   */
  errorResponse(req: Request, res: Response, next: NextFunction) {
    next(new Error("エラー発生"));
  }
}
