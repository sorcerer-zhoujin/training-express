import {
  getAllUsersSrv,
  createUserSrv,
  getUserSrv,
  updateUserSrv,
  loginSrv,
  buyItemSrv,
  useItemSrv,
} from "../services/UserService";

import {
  NotFoundError,
  AuthError,
  NotEnoughError,
  LimitExceededError,
} from "../interfaces/my-error";

import * as db_user from "../models/UserModel";
import * as db_users_items from "../models/usersItemsModel";

const mock_data_user_1: any = {
  id: 1,
  name: "user1",
  password: "password",
  money: 10,
  hp: 10,
};
const mock_data_user_2: any = {
  id: 2,
  name: "user2",
  password: "password",
  money: 10,
  hp: 10,
};
const mock_data_all_users: any = [mock_data_user_1, mock_data_user_2];
const mock_data_all_users_empty: any = [];

const mock_data_user_item: any = {
  id: 1,
  user_id: 1,
  item_id: 1,
  num: 10,
};

test("get all users", async () => {
  jest
    .spyOn(db_user, "getAllUsers")
    .mockImplementationOnce(() => mock_data_all_users)
    .mockImplementationOnce(() => mock_data_all_users_empty);

  expect(await getAllUsersSrv()).toEqual(mock_data_all_users);
  expect(await getAllUsersSrv()).toEqual(mock_data_all_users_empty);
});

test("create user", async () => {
  jest.spyOn(db_user, "createUser").mockImplementation((data: any[]) => {
    mock_data_all_users.push({
      id: mock_data_all_users.length + 1,
      name: data[0],
      password: data[1],
      money: data[2],
      hp: data[3],
    });
    return mock_data_all_users.length;
  });

  expect(await createUserSrv([])).toEqual(mock_data_all_users.length);
});

test("get user", async () => {
  jest.spyOn(db_user, "getUser").mockImplementation((id: number) => {
    return mock_data_all_users[id];
  });

  expect(await getUserSrv({ id: 0 })).toEqual(mock_data_user_1);
  expect(await getUserSrv({ id: 1 })).toEqual(mock_data_user_2);

  // user id存在しない
  try {
    await getUserSrv({ id: 100 });
  } catch (e) {
    expect(e instanceof NotFoundError).toBeTruthy();
  }
});

test("update user", async () => {
  jest.spyOn(db_user, "updateUser").mockImplementation((data: any[]) => {
    return new Promise((resolve, reject) => {
      resolve(true);
    });
  });

  expect(
    await updateUserSrv(
      { id: 1 },
      { name: "test", password: "test", money: 10, hp: 10 }
    )
  ).toBeTruthy();
});

test("login user", async () => {
  jest.spyOn(db_user, "getUser").mockImplementation((id: number) => {
    return mock_data_all_users[id];
  });

  expect(
    await loginSrv({
      id: mock_data_all_users[0].id,
      password: mock_data_all_users[0].password,
    })
  ).toBeTruthy();

  // wrong password
  try {
    expect(
      await loginSrv({
        id: mock_data_all_users[0].id,
        password: "",
      })
    ).toBeTruthy();
  } catch (e) {
    expect(e instanceof AuthError).toBeTruthy();
  }
});

test("buy item", async () => {
  jest
    .spyOn(db_users_items, "getUserItem")
    .mockImplementation((id: number, item_id: number) => {
      if (
        id == mock_data_user_item.id &&
        item_id == mock_data_user_item.item_id
      )
        return mock_data_user_item;
      else return;
    });

  jest.spyOn(db_user, "getUser").mockImplementation((id: number) => {
    return mock_data_all_users[id];
  });

  // 1. 成功
  expect(await buyItemSrv({ id: 1, item_id: 1, num: 1 }));
  // 2. item_id存在しない
  try {
    expect(await buyItemSrv({ id: 1, item_id: 10, num: 1 }));
  } catch (e) {
    expect(e instanceof NotFoundError).toBeTruthy();
  }
  // 3. item num　上限
  mock_data_user_item.num = 20;
  try {
    expect(await buyItemSrv({ id: 1, item_id: 1, num: 1 }));
  } catch (e) {
    expect(e instanceof LimitExceededError).toBeTruthy();
  }

  // 4. user money not enough
  mock_data_user_item.num = 0;
  try {
    expect(await buyItemSrv({ id: 1, item_id: 1, num: 20 }));
  } catch (e) {
    expect(e instanceof NotEnoughError).toBeTruthy();
  }
});
