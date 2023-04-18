import { Response, Request, NextFunction } from "express";
import * as DataProcService from "../services/data-proc-service";

const log = require("log4js").getLogger("index");

export class HogeController {
  async getHoge(req: Request, res: Response) {
    log.info("start getHoge");
    DataProcService.waitAndExec();
    res.send("ok");
  }

  async postHoge(req: Request, res: Response) {
    log.info("start postHoge");
    res.json({ text: "post Hoge" });
  }

  /**
   * next(err)を投げるとapp.tsでエラーハンドリングできます。
   * https://expressjs.com/ja/guide/error-handling.html
   */
  errorResponse(req: Request, res: Response, next: NextFunction) {
    next(new Error("エラー発生"));
  }
}
