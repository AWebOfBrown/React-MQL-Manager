import regeneratorRuntime from "regenerator-runtime";

class Debouncer {
  constructor() {
    this.iterator = this.debouncer();
    this.iterator.next();
  }

  *debouncer() {
    while (true) {
      let { fn, wait } = yield;
      let pendingFunction;
      while (wait) {
        clearTimeout(pendingFunction);
        pendingFunction = setTimeout(
          () => this.iterator.next({ fn, wait: 0 }),
          wait
        );
        ({ fn, wait } = yield);
      }
      clearTimeout(pendingFunction);
      fn();
    }
  }

  send(fn, wait = 0) {
    if (typeof fn !== "function")
      throw new TypeError(
        `The first argument to Debouncer.send() must be a function`
      );

    if (typeof wait !== "number")
      throw new TypeError(
        `The second argument to Debouncer.send() must be a number representing the debounce duration (in microseconds)`
      );
    this.iterator.next({ fn, wait });
  }
}

export default Debouncer;
