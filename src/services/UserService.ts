import {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
} from "../models/UserModel";

import { getUserItem, updateUserItem } from "../models/usersItemsModel";

import {
  DBError,
  NotFoundError,
  AuthError,
  NotEnoughError,
  LimitExceededError,
} from "../interfaces/my-error";

import { User, UserLogin } from "../interfaces/User";
import { UserItemInput, UserItemOutput } from "../interfaces/user-item";

const MAX_ITEMS_NUM = 20;

const getAllUsersSrv = async () => {
  const result = await getAllUsers();
  return result;
};

const createUserSrv = async (data: User) => {
  const result: number = await createUser(data);
  return result;
};

const getUserSrv = async (data: number) => {
  try {
    const result = await getUser(data);
    return result;
  } catch (e) {
    if (e instanceof NotFoundError) throw new NotFoundError();
    else throw e;
  }
};

const updateUserSrv = async (data: User) => {
  try {
    const result: boolean = await updateUser(data);

    if (result) {
      return result;
    } else {
      throw new NotFoundError();
    }
  } catch (e) {
    if (e instanceof NotFoundError) throw new NotFoundError();
    else throw e;
  }
};

const loginSrv = async (data: UserLogin) => {
  try {
    const result: User = await getUser(data.id);

    // password check
    if (result && result.password == data.password) {
      return result;
    } else {
      throw new AuthError();
    }
  } catch (e) {
    if (e instanceof AuthError) throw new AuthError();
    else throw e;
  }
};

const buyItemSrv = async (data: UserItemInput) => {
  //logic
  try {
    //1. get user_item data
    let user_item = await getUserItem(data);
    let user = await getUser(data.id);
    let item_price = 1; //TODO

    //2. if limit?
    if (user_item.num + data.num > MAX_ITEMS_NUM) {
      throw new LimitExceededError();
    }
    //3. if money?
    let cost = item_price * data.num;
    if (cost > user.money!) {
      throw new NotEnoughError();
    }

    //3.1 items += num;
    user_item.num += data.num;
    updateUserItem({ id: data.id, item_id: data.item_id, num: user_item.num });
    //3.2 money -= cost;
    user.money! -= cost;
    updateUser({
      id: data.id,
      name: user.name,
      password: user.password,
      money: user.money,
      hp: user.hp,
    });
  } catch (e) {
    if (e instanceof NotEnoughError) throw new NotEnoughError();
    else if (e instanceof NotFoundError) throw new NotFoundError();
    else if (e instanceof LimitExceededError) throw new LimitExceededError();
    else throw e;
  }
};

const useItemSrv = async (data: UserItemInput) => {
  //logic
  try {
    //1. get user_item data
    let user_item = await getUserItem(data);
    let user = await getUser(data.id);
    let item_heal = 1; //TODO

    //3. if enough?
    if (data.num > user_item.num) {
      throw new NotEnoughError();
    }

    //3.1 items -= num;
    user_item.num += data.num;
    //3.2 hp += heal;
    user.hp! += item_heal * data.num;
  } catch (e) {
    if (e instanceof NotEnoughError) throw new NotEnoughError();
    else if (e instanceof NotFoundError) throw new NotFoundError();
    else throw e;
  }
};

export {
  getAllUsersSrv,
  createUserSrv,
  getUserSrv,
  updateUserSrv,
  loginSrv,
  buyItemSrv,
  useItemSrv,
};
// curl -X "GET" "http://localhost:3000/users" -H "accept: application/json"
