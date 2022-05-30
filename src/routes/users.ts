import * as express from "express";
import { UserController } from "../controllers";
export const router = express.Router();

const userController = new UserController();

//    /users

router.get("/", userController.getAllUsers);
router.post("/", userController.createUser);
router.get("/:id", userController.getUser);
router.put("/:id", userController.updateUser);
