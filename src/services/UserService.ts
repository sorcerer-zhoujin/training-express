import {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
} from "../models/UserModel";

import { DBError, NotFoundError, AuthError } from "../interfaces/my-error";

const getAllUsersSrv = async () => {
  try {
    const result = await getAllUsers();
    return result;
  } catch (error) {
    throw new DBError("db error");
  }
};

const createUserSrv = async (data: any) => {
  let arr: any[] = [];
  arr.push(data.name);
  arr.push(data.password);
  arr.push(data.money);
  arr.push(data.hp);

  try {
    const result = await createUser(arr);
    return result;
  } catch (error) {
    throw new DBError("db error");
  }
};

const getUserSrv = async (data: any) => {
  let id = data.id;

  try {
    const result: any = await getUser(id);

    if (result[0]) {
      return result[0];
    } else {
      throw new NotFoundError("User not found");
    }
  } catch (error) {
    throw new DBError("db error");
  }
};

const updateUserSrv = async (params: any, data: any) => {
  let id = parseInt(params.id);
  let arr: any[] = [];
  arr.push(data.name);
  arr.push(data.password);
  arr.push(data.money);
  arr.push(data.hp);
  arr.push(id);

  try {
    const result: any = await updateUser(arr);

    if (result.affectedRows != 0) {
      return result.affectedRows;
    } else {
      throw new NotFoundError("not found");
    }
  } catch (error) {
    throw new DBError("db error");
  }
};

const loginSrv = async (data: any) => {
  let id = data.id;

  try {
    const result: any = await getUser(id);

    // password check
    if (result[0] && result[0].password == data.password) {
      return result[0];
    } else {
      throw new AuthError("認証失敗");
    }
  } catch (error) {
    throw new DBError("db error");
  }
};

export { getAllUsersSrv, createUserSrv, getUserSrv, updateUserSrv, loginSrv };
// curl -X "GET" "http://localhost:3000/users" -H "accept: application/json"
