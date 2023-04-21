interface PlayerItem {
  player_id?: number;
  item_id?: number;
  count?: number;
}

interface PlayerItemJson {
  itemId?: number;
  count?: number;
}

export { PlayerItem, PlayerItemJson };
