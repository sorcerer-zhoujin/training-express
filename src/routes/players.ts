import * as express from "express";
import { PlayerController } from "../controllers";
export const router = express.Router();

const playerController = new PlayerController();

router.get("/", playerController.getAllPlayers);
router.post("/", playerController.createPlayer);
