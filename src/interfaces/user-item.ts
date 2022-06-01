interface UserItemInput {
  id: number;
  item_id: number;
  num: number;
}

interface UserItemOutput {
  id: number;
  user_id: number;
  item_id: number;
  num: number;
}

export { UserItemInput, UserItemOutput };
