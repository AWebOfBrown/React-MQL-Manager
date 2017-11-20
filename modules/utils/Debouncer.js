class Debouncer {
  constructor() {
    this.iterator = this.debouncer();
    this.iterator.next();
  }

  *debouncer() {
    while (true) {
      let { fn, wait, immediate } = yield;
      if (wait || immediate) {
        while (wait) {
          ({ fn, wait } = yield setTimeout(
            () => this.iterator.next({ fn, wait: 0 }),
            wait
          ));
        }
        fn();
      }
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

    let immediate = false;
    if (wait === 0) immediate = true;
    this.iterator.next({ fn, wait, immediate });
  }
}

export default Debouncer;
