import { db_pool } from "../helpers/DBHelper";

const getUserItem = async (id: number, item_id: number) => {
  const [rows, fields] = await db_pool
    .promise()
    .query("SELECT * FROM `users_items` WHERE `user_id` = ? && `item_id` =?", [
      id,
      item_id,
    ]);
  return (rows as any)[0];
};

const updateUserItem = async (id: number, item_id: number, num: number) => {
  const [rows, fields] = await db_pool
    .promise()
    .query(
      "UPDATE `users_items` SET  `num`= ? WHERE `id` = ? && `item_id` = ?",
      [num, id, item_id]
    );
  return (rows as any).affectedRows != 0 ? true : false;
};

export { getUserItem, updateUserItem };
