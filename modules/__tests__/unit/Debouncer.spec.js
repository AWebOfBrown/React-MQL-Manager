import Debouncer from "../../utils/Debouncer";
const newDebouncer = new Debouncer();

describe(`Debouncer`, () => {
  test(`should synchronously call fn when wait = 0`, () => {
    const funcSpy = jest.fn(() => null);
    newDebouncer.send(funcSpy, 0);
    expect(funcSpy).toHaveBeenCalled();
  });

  test(`should debounce calls with a wait period`, done => {
    const funcSpy = jest.fn(() => null);
    newDebouncer.send(funcSpy, 1000);
    newDebouncer.send(funcSpy, 1000);
    newDebouncer.send(funcSpy, 1000);
    expect(funcSpy).not.toHaveBeenCalled();

    setTimeout(() => {
      expect(funcSpy).toHaveBeenCalledTimes(1);
      done();
    }, 1100);
  });

  test(`fn debounced with wait = 0 should override prev debounce`, done => {
    const funcSpy = jest.fn(() => null);
    newDebouncer.send(funcSpy, 1000);
    newDebouncer.send(funcSpy, 0);
    expect(funcSpy).toHaveBeenCalledTimes(1);

    setTimeout(() => {
      expect(funcSpy).toHaveBeenCalledTimes(1);
      done();
    }, 1100);
  });
});
