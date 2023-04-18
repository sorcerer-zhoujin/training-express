// import * as foo from "./foo";

import * as math from "./math";
import { myadd } from "./foo";

test("add", () => {
  jest.spyOn(math, "add").mockImplementation((a: number, b: number) => {
    return 100;
  });

  expect(myadd(1, 2)).toBe(100);
});

test("mock", () => {
  const myMockFn = jest
    .fn((a) => 10)
    .mockImplementationOnce(() => 1)
    .mockImplementationOnce(() => 2);
  expect(myMockFn(10)).toBe(1);
  expect(myMockFn(10)).toBe(2);
  expect(myMockFn(10)).toBe(10);
});
