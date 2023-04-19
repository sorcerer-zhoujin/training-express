import * as playerModel from "../models/player-model";
import { Player } from "../interfaces/player";
import { PoolConnection } from "mysql2/promise";

const getAllPlayers = async (dbConnection: PoolConnection): Promise<Player[]> => {
  const result = await playerModel.getAllPlayers(dbConnection);
  return result;
};

const getPlayerById = async (playerId: number, dbConnection: PoolConnection): Promise<Player[]> => {
  const result = await playerModel.getPlayerById(playerId, dbConnection);
  return result;
}

const createPlayer = async (
  data: Player,
  dbConnection: PoolConnection
): Promise<number> => {
  const result: number = await playerModel.createPlayer(data, dbConnection);
  return result;
};

export { getAllPlayers, getPlayerById, createPlayer };
