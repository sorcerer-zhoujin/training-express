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

const MAX_ITEMS_NUM = 20;

const getAllUsersSrv = async () => {
  const result = await getAllUsers();
  return result;
};

const createUserSrv = async (data: any) => {
  let arr: any[] = [];
  arr.push(data.name);
  arr.push(data.password);
  arr.push(data.money);
  arr.push(data.hp);

  const result: number = await createUser(arr);
  return result;
};

const getUserSrv = async (data: any) => {
  let id = data.id;

  try {
    const result = await getUser(id);

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

const updateUserSrv = async (params: any, data: any) => {
  let id = parseInt(params.id);
  let arr: any[] = [];
  arr.push(data.name);
  arr.push(data.password);
  arr.push(data.money);
  arr.push(data.hp);
  arr.push(id);

  try {
    const result: boolean = await updateUser(arr);

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

const loginSrv = async (data: any) => {
  let id = data.id;

  try {
    const result: any = await getUser(id);

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

const buyItemSrv = async (data: any) => {
  const id = data.id;
  const item_id = data.item_id;
  const num = data.num;

  //logic
  try {
    //1. get user_item data
    let user_item: any = await getUserItem(id, item_id);
    let user: any = await getUser(id);
    let item_price = 1; //TODO

    if (!user_item) {
      throw new NotFoundError();
    }
    //2. if limit?
    if (user_item.num + num > MAX_ITEMS_NUM) {
      throw new LimitExceededError();
    }
    //3. if money?
    let cost = item_price * num;
    if (cost > user.money) {
      throw new NotEnoughError();
    }

    //3.1 items += num;
    user_item.num += num;
    //3.2 money -= cost;
    user.money -= cost;
    updateUserItem(id, item_id, user_item.num);

    let arr: any[] = [];
    arr.push(user.name);
    arr.push(user.password);
    arr.push(user.money);
    arr.push(user.hp);
    arr.push(id);
    updateUser(arr);
  } catch (e) {
    if (e instanceof NotEnoughError) throw new NotEnoughError();
    else if (e instanceof NotFoundError) throw new NotFoundError();
    else if (e instanceof LimitExceededError) throw new LimitExceededError();
    else throw e;
  }
};

const useItemSrv = async (data: any) => {
  const id = data.id;
  const item_id = data.item_id;
  const num = data.num;

  //logic
  try {
    //1. get user_item data
    let user_item: any = await getUserItem(id, item_id);
    let user: any = await getUser(id);
    let item_heal = 10; //TODO
    if (!user_item) {
      throw new NotFoundError();
    }

    //3. if enough?
    if (num > user_item.num) {
      throw new NotEnoughError();
    }

    //3.1 items -= num;
    user_item.num += num;
    //3.2 hp += heal;
    user.hp += item_heal * num;
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
