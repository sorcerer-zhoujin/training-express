import * as express from "express";
import {HogeController} from "../controllers";
export const router = express.Router();

const hogeController = new HogeController();

router.get('/', (req, res, next) => {
  res.status(200);
  res.json({text: 'foo'});
});

router.get("/hoge", hogeController.getHoge);
router.post("/hoge", hogeController.postHoge);