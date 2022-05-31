let cnt: number = 0;

function fun1() {
  console.log("fun1 call, ", cnt);
  cnt++;
}

class Fun {
  cnt: number;
  constructor() {
    this.cnt = 0;
  }
  show() {
    console.log("show ", cnt);
    cnt++;
  }
}

function createFun() {
  return new Fun();
}

const fun3 = createFun();

const fun4 = (a: number, b: number, callback: Function) => {
  a++;
  b++;
  callback(a, b);
};

export { fun1, fun3, fun4 };
