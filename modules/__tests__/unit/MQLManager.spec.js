import { MQLManager } from "../../index";
import { queries, mockMatchMedia } from "../testUtils";

let onChangeSpy;
let testMQLManager;
let debounce = 2000;

beforeAll(() => {
  window.matchMedia = mockMatchMedia;

  onChangeSpy = jest.fn(matchState => matchState);
  testMQLManager = new MQLManager({
    queries,
    onChange: onChangeSpy,
    debounce
  });
});

describe("MQLManager", () => {
  test("should call onChange during initialisation", () => {
    expect(onChangeSpy).toHaveBeenCalled();
  });

  it("should internally construct Media Query Lists", () => {
    Object.keys(queries).forEach(key =>
      expect(testMQLManager.MQLs).toHaveProperty(key)
    );
  });

  test("should debounce calls to onChange", done => {
    testMQLManager.broadcastState();
    testMQLManager.broadcastState();
    testMQLManager.broadcastState();
    // expect one call to onChangeSpy from init,
    // 1 more after debouncing above three calls:
    expect(onChangeSpy).toHaveBeenCalledTimes(1);
    setTimeout(() => {
      expect(onChangeSpy).toHaveBeenCalledTimes(2);
      done();
    }, debounce + 100);
  });

  it(`should error if an MQL's media prop === "not all", as its query is incorrectly written.`, function() {
    let badQueryManager = new MQLManager({
      queries: { faultyQueryName: "not used" },
      onChange: onChangeSpy,
      debounce: 1000
    });
    this.badMQL = { media: "not all" };

    expect(() =>
      badQueryManager.validateMQLMedia(this.badMQL, "faultyQueryName")
    ).toThrowError(/ignored/);
  });

  it(`should error if onChange arg is null or not a function`, () => {
    expect(
      () =>
        new MQLManager({
          queries,
          onChange: null,
          debounce: 0
        })
    ).toThrowError(/onChange function/);

    expect(
      () =>
        new MQLManager({
          queries,
          onChange: 10,
          debounce: 0
        })
    ).toThrowError(/onChange function/);
  });

  it(`should error if queries arg is null or not an object`, () => {
    expect(
      () =>
        new MQLManager({
          queries: null,
          onChange: onChangeSpy,
          debounce: 0
        })
    ).toThrowError();

    expect(
      () =>
        new MQLManager({
          queries: () => {},
          onChange: onChangeSpy,
          debounce: 0
        })
    ).toThrowError();
  });

  it(`should error if queries argument's values are not strings`, () => {
    expect(
      () =>
        new MQLManager({
          queries: { one: 1 },
          onChange: onChangeSpy,
          debounce
        })
    ).toThrowError(/query strings/);
  });

  it(`should error if debounce arg is present and not a number`, () => {
    expect(
      () =>
        new MQLManager({
          queries,
          onChange: onChangeSpy,
          debounce: "hi"
        })
    ).toThrowError(/Debounce/);
  });
});
