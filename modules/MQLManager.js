import Debouncer from "./utils/Debouncer";
const BroadcastDebouncer = new Debouncer();

class MQLManager {
  constructor({ queries, debounce = 0, onChange }) {
    this.MQLs = {};
    this.queries = queries;
    this.debounce = debounce;
    this.onChange = onChange;

    this.validateArgs({ queries, debounce, onChange });
    this.constructMQLs();
  }

  validateArgs({ queries, debounce, onChange }) {
    if (!onChange || typeof onChange !== "function") {
      throw new Error(
        `Provide an onChange function to MQLManager
         in order to update your state! `
      );
    }

    if (!queries || typeof queries !== "object") {
      throw new Error(
        `Please provide MQLManager with an object of media query strings`
      );
    }

    for (let query in queries) {
      if (typeof queries[query] !== "string") {
        throw new Error(
          `Values of queries object provided to MQLManager must be media query strings`
        );
      }
    }

    if (debounce && typeof debounce !== "number") {
      throw new Error(
        `Debounce prop provided to MQLManager should be type: Num (of microseconds)`
      );
    }
  }

  broadcastState({ immediate } = { immediate: false }) {
    BroadcastDebouncer.send(
      () => this.onChange(this.getMatchState()),
      immediate ? 0 : this.debounce
    );
  }

  constructMQLs() {
    Object.keys(this.queries).forEach(queryName => {
      this.MQLs[queryName] = window.matchMedia(this.queries[queryName]);
      this.validateMQLMedia(this.MQLs[queryName], queryName);
      this.MQLs[queryName].addListener(() => this.broadcastState());
    });
    this.broadcastState({ immediate: true });
  }

  validateMQLMedia(MQL, queryName) {
    if (MQL.media === "not all") {
      throw new Error(`The MQL media query for MQLManager.queries["${queryName}"] is being ignored, likely because
        the provided media query string for that key is invalid. Please alter this query string: ${this
          .queries[queryName]}. For more details: https://goo.gl/QvLybE`);
    }
  }

  getMatchState() {
    let matchState = Object.keys(
      this.MQLs
    ).reduce((accumulator, currentKey) => {
      accumulator[currentKey] = this.MQLs[currentKey].matches;
      return accumulator;
    }, {});
    return matchState;
  }
}

export default MQLManager;
