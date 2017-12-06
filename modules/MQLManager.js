import Debouncer from "./utils/Debouncer";

class MQLManager {
  constructor({ queries, debounce = 0, onChange, parentMounted = true }) {
    this.MQLs = {};
    this.debounce = debounce;
    this.onChange = onChange;
    this.BroadcastDebouncer = new Debouncer();
    this.listenersAttached = false;

    this.getMatchState = this.getMatchState.bind(this);
    this.addListeners = this.addListeners.bind(this);
    this.removeListeners = this.removeListeners.bind(this);
    this._broadcastState = this._broadcastState.bind(this);

    this._validateArgs({
      queries,
      debounce,
      onChange,
      parentMounted
    });

    if (typeof window === "object") {
      this._constructMQLs({ queries, parentMounted });
    } else {
      this._constructMQLsServerSide({ queries });
    }
  }

  _validateArgs({ queries, debounce, onChange, parentMounted }) {
    if (typeof parentMounted !== "boolean") {
      throw new Error(
        `parentMounted argument provided to MQLManager must be a Boolean.`
      );
    }

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

    Object.values(queries).forEach(query => {
      if (typeof query !== "string") {
        throw new Error(
          `Values of queries object provided to MQLManager must be media query strings`
        );
      }
    });

    if (debounce && typeof debounce !== "number") {
      throw new Error(
        `Debounce prop provided to MQLManager should be type: Num (of milliseconds)`
      );
    }
  }

  _broadcastState() {
    this.BroadcastDebouncer.send(
      () => this.onChange(this.getMatchState()),
      this.debounce
    );
  }

  _constructMQLsServerSide({ queries }) {
    this.MQLs = Object.keys(queries).reduce((MQLs, currentKey) => {
      MQLs[currentKey] = { matches: true };
      return MQLs;
    }, {});
  }

  _constructMQLs({ queries, parentMounted }) {
    Object.keys(queries).forEach(queryName => {
      this.MQLs[queryName] = window.matchMedia(queries[queryName]);
      MQLManager.validateMQLMedia(this.MQLs[queryName], queryName);
    });

    if (parentMounted) {
      this.addListeners();
    }
  }

  addListeners() {
    if (!this.listenersAttached) {
      Object.keys(this.MQLs).forEach(MQL => {
        this.MQLs[MQL].addListener(this._broadcastState);
      });
      this.listenersAttached = true;
    }
  }

  removeListeners() {
    if (this.listenersAttached) {
      Object.keys(this.MQLs).forEach(MQL => {
        this.MQLs[MQL].removeListener(this._broadcastState);
      });
    }
  }

  static validateMQLMedia(MQL, queryName) {
    if (MQL.media === "not all") {
      throw new Error(`The MQL media query for MQLManager.queries["${queryName}"] is being ignored, likely because
        the provided media query string for that key is invalid. Please alter this query string. For more details: https://goo.gl/QvLybE`);
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
