import * as express from "express";
import { PlayerController } from "../controllers";
import { PlayerItemController } from "../controllers";
export const router = express.Router();

const playerController = new PlayerController();
const playerItemController = new PlayerItemController();

// players
router.get("/", playerController.getAllPlayers);
router.get("/:playerId", playerController.getPlayerById);
router.post("/", playerController.createPlayer);
router.put("/:playerId", playerController.updatePlayer);
router.delete("/:playerId", playerController.deletePlayer);

//player_items
router.get("/:playerId/getAllItems", playerItemController.getAllItems);
router.post("/:playerId/addItem", playerItemController.addItem);
router.post("/:playerId/useItem", playerItemController.useItem);
