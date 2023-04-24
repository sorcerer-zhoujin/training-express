interface PlayerItem {
  playerId?: number;
  itemId?: number;
  count?: number;
}

interface PlayerItemJson {
  itemId?: number;
  count?: number;
}

export { PlayerItem, PlayerItemJson };
