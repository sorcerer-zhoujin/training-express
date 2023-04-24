import { Player } from "./player";

interface PlayerItem {
  playerId?: number;
  itemId?: number;
  count?: number;
}

interface PlayerItemJson {
  itemId?: number;
  count?: number;
}

interface PlayerAndItem {
  player: Player;
  playerItem: PlayerItem;
}

export { PlayerItem, PlayerItemJson };
