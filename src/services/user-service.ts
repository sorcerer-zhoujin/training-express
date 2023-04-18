import * as userModel from "../models/user-model";
import { User } from "../interfaces/user";
import { PoolConnection } from "mysql2/promise";

const getAllUsers = async (dbConnection: PoolConnection): Promise<User[]> => {
  const result = await userModel.getAllUsers(dbConnection);
  return result;
};

const createUser = async (
  data: User,
  dbConnection: PoolConnection
): Promise<number> => {
  const result: number = await userModel.createUser(data, dbConnection);
  return result;
};

export { getAllUsers, createUser };
