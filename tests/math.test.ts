import { add } from "./math";

describe("math test", () => {
  test("add", () => {
    expect(add(1, 2)).toBe(3);
    expect(add(99, 100)).toBe(199);
  });
});
