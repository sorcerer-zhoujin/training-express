/**
 * ヘルパー関数の作り方と使い方はここを参考にした
 * https://medium.com/@OlegVaraksin/what-is-the-best-way-to-write-utilities-in-typescript-e3cae916fe30
 */
import { Days } from "../interfaces/date-interface";

export function nowDate(): Date {
  return new Date();
}

/**
 * 引数の型を独自に定義しています。
 */
export function addMinutes(days: Days): Date {
  return new Date(days.date.getTime() + days.minutes * 60 * 1000);
}
