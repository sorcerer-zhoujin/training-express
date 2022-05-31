import { Response, Request, NextFunction } from "express";
import {
  getAllUsersSrv,
  createUserSrv,
  getUserSrv,
  updateUserSrv,
  loginSrv,
  buyItemSrv,
  useItemSrv,
} from "../services/UserService";

import {
  DBError,
  NotFoundError,
  AuthError,
  NotEnoughError,
  LimitExceededError,
} from "../interfaces/my-error";

const log = require("log4js").getLogger("index");

export class UserController {
  async getAllUsers(req: Request, res: Response) {
    try {
      const result = await getAllUsersSrv();

      res.status(200);
      res.json(result);
    } catch (e) {
      throw e;
    }
  }

  async createUser(req: Request, res: Response) {
    if (
      !req.body.name ||
      !req.body.password ||
      !req.body.money ||
      !req.body.hp
    ) {
      res.status(400);
      res.json({ message: "Invalid parameters or body." });
      return;
    }

    try {
      const result = await createUserSrv(req.body);
      res.status(200);
      res.json({ id: result });
    } catch (e) {
      // if (e instanceof DBError) {
      //   res.status(500).end();
      // }
      throw e;
    }
  }

  async getUser(req: Request, res: Response) {
    if (!req.params.id) {
      res.status(400);
      res.json({ message: "Invalid parameters or body." });
      return;
    }

    try {
      const result = await getUserSrv(req.params);

      res.status(200);
      res.json(result);
    } catch (e) {
      if (e instanceof NotFoundError) {
        res.status(404).end();
      } else {
        throw e;
      }
    }
  }

  async updateUser(req: Request, res: Response) {
    if (
      !req.params.id ||
      !req.body.name ||
      !req.body.password ||
      !req.body.money ||
      !req.body.hp
    ) {
      res.status(400);
      res.json({ message: "Invalid parameters or body." });
      return;
    }

    try {
      const result = await updateUserSrv(req.params, req.body);
      if (result) {
        res.status(200).end();
      }
    } catch (e) {
      if (e instanceof NotFoundError) {
        res.status(404).end();
      } else {
        throw e;
      }
    }
  }

  async login(req: Request, res: Response) {
    if (!req.body.id || !req.body.password) {
      res.status(400);
      res.json({ message: "Invalid parameters or body." });
      return;
    }

    try {
      const result = await loginSrv(req.body);
      if (result) {
        res.status(200).end();
      }
    } catch (e) {
      if (e instanceof AuthError) {
        res.status(401).end(e.message);
      } else {
        throw e;
      }
    }
  }

  async buyItem(req: Request, res: Response) {
    if (!req.body.id || !req.body.item_id || !req.body.num) {
      res.status(400);
      res.json({ message: "Invalid parameters or body." });
      return;
    }

    try {
      const result = await buyItemSrv(req.body);
      res.status(200).end();
    } catch (e) {
      if (e instanceof NotEnoughError) {
        res.status(403).end();
      } else if (e instanceof NotFoundError) {
        res.status(404).end();
      } else if (e instanceof LimitExceededError) {
        res.status(405).end();
      } else {
        throw e;
      }
    }
  }

  async useItem(req: Request, res: Response) {
    if (!req.body.id || !req.body.item_id || !req.body.num) {
      res.status(400);
      res.json({ message: "Invalid parameters or body." });
      return;
    }

    try {
      const result = await useItemSrv(req.body);
      res.status(200).end();
    } catch (e) {
      if (e instanceof NotEnoughError) {
        res.status(403).end();
      } else if (e instanceof NotFoundError) {
        res.status(404).end();
      } else {
        throw e;
      }
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
