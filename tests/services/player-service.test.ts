import { getAllPlayers, getPlayerById, createPlayer, updatePlayer, deletePlayer } from "../../src/services/player-service";
import { Player } from "../../src/interfaces/player";
import * as playerModel from "../../src/models/player-model";

const mockDataPlayer1: Player = {
  id: 1,
  name: "Player1",
  money: 10,
  hp: 10,
  mp: 10
};
const mockDataPlayer2: Player = {
  id: 2,
  name: "Player2",
  money: 100,
  hp: 100,
  mp: 100
};
const mockDataAllPlayers: Player[] = [mockDataPlayer1, mockDataPlayer2];
const mockDataAllPlayersEmpty: Player[] = [];

test("get all players", async () => {
  jest.spyOn(playerModel, "getAllPlayers")
      .mockResolvedValueOnce(mockDataAllPlayers)
      .mockResolvedValueOnce(mockDataAllPlayersEmpty);

  let conn: any;
  expect(await getAllPlayers(conn)).toEqual(mockDataAllPlayers);
  expect(await getAllPlayers(conn)).toEqual(mockDataAllPlayersEmpty);
});

test("get player by id", async () => {
  jest.spyOn(playerModel, "getPlayerById")
      .mockResolvedValueOnce(mockDataPlayer1);

    let id: any, conn: any;
    expect(await getPlayerById(id, conn)).toEqual(mockDataPlayer1);
});

test("create player", async () => {
  jest.spyOn(playerModel, "createPlayer")
      .mockImplementation(async (data: Player) => {
        mockDataAllPlayers.push({
          id: mockDataAllPlayers.length + 1,
          name: data.name,
          money: data.money,
          hp: data.hp,
          mp: data.mp
        });
        return mockDataAllPlayers.length;
  });

  let conn: any;
  expect(
    await createPlayer(
      { name: "test", money: 10, hp: 10, mp: 10 },
      conn
    )
  ).toEqual(mockDataAllPlayers.length);
});

test("update player", async () => {
  jest.spyOn(playerModel, "updatePlayer")
      .mockResolvedValueOnce(mockDataPlayer1);

  let id: any, conn: any;
  expect(await updatePlayer(id, mockDataPlayer2, conn)).toEqual(mockDataPlayer1);
})

test("delete player", async () => {
  const random = Math.floor(Math.random() * 1000) + 1;

  jest.spyOn(playerModel, "deletePlayer")
  .mockResolvedValueOnce(random);

  let id: any, conn:any;
  expect(await deletePlayer(id, conn)).toBe(random);
});
