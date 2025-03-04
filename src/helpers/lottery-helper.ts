const lottery = (percent: number[], times: number) => {
  const MAX_PERCENT = 100;
  let totalPercent = percent.reduce((total, num) => total + num);

  if (totalPercent < MAX_PERCENT) {
    percent[0] = MAX_PERCENT - totalPercent;
    totalPercent = MAX_PERCENT;
  }

  const result: number[] = [];

  for (let i = 0; i < times; i++) {
    const random = Math.floor(Math.random() * MAX_PERCENT) + 1;
    let currentPercent = 0;

    for (const [id, per] of percent.entries()) {
      currentPercent += per;
      if (currentPercent >= random) {
        result.push(id);
        break;
      }
    }
  }
  return result;
}

export { lottery };
