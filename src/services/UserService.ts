import { getAllUsers, createUser } from "../models/UserModel";

const getAllUsersSrv = async () => {
  try {
    const result = await getAllUsers();
    return {
      statusCode: 200,
      data: result,
    };
  } catch (error) {
    return {
      statusCode: 500,
      data: "db error",
    };
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
    const data = {
      id: result,
    };
    return {
      statusCode: 200,
      data: data,
    };
  } catch (error) {
    return {
      statusCode: 500,
      data: "db error",
    };
  }
};

export { getAllUsersSrv, createUserSrv };
// curl -X "GET" "http://localhost:3000/users" -H "accept: application/json"
