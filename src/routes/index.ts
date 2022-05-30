import * as express from "express";
import * as foo from "./foo";
import * as users from "./users";

import { HogeController, UserController } from "../controllers";

import { db_connection } from "../helpers/DBHelper";

export const router = express.Router();

const hogeController = new HogeController();
const userController = new UserController();

router.get("/", (req, res, next) => {
  res.status(200);
  res.json({ text: "Hello World" });
});
router.get("/errorSample", hogeController.errorResponse);

router.use("/foo", foo.router);

//test mysql2
router.get("/db", (req, res, next) => {
  db_connection.query(
    "SELECT COUNT(*) FROM `users_items`;",
    (err, results, fields) => {
      results = results;

      res.status(200);
      res.json({ text: results });
    }
  );
});

router.use("/users", users.router);
router.post("/login", userController.login);
