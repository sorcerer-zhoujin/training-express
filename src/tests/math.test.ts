import { add } from "./math";

describe("math test", () => {
  test("add", () => {
    expect(add(1, 2)).toBe(3);
  });
});
