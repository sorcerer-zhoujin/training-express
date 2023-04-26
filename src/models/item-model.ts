import { PoolConnection } from "mysql2/promise";
import { RowDataPacket} from "mysql2";
import { Item } from "../interfaces/item";

const getAllItems = async (dbConnection: PoolConnection): Promise<Item[]> => {
  const [rows] = await dbConnection.query<RowDataPacket[]>(
    "SELECT * FROM `items`"
  );

  const result: Item[] = rows.map((row) => {
    return {
      id: row.id,
      name: row.name,
      heal: row.heal,
      price: row.price,
      percent: row.percent
    };
  });
  return result;
}

export { getAllItems }
