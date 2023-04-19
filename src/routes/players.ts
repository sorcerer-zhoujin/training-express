import * as express from "express";
import { PlayerController } from "../controllers";
export const router = express.Router();

const playerController = new PlayerController();

router.get("/", playerController.getAllPlayers);
router.get("/:playerId", playerController.getPlayerById);
router.post("/", playerController.createPlayer);
router.put("/:playerId", playerController.updatePlayer);
router.delete("/:playerId", playerController.deletePlayer);
