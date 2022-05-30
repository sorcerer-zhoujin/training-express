import * as DateHelper from "../helpers/DateHelper";

/**
 * 仮のビジネスロジックです。
 */
export function waitAndExec() {
  // ヘルパー関数を呼び出す
  const now = DateHelper.nowDate();
  const nextTime = DateHelper.addMinutes({ date: now, minutes: 10 });
  console.log(`wait until ${nextTime} and exec`);
}
