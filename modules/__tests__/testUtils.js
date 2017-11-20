const queries = {
  S: "(max-width: 480px)",
  M: "(min-width: 481px) and (max-width: 1079px)",
  L: "(min-width: 1080px)"
};

const mockMatchMedia = () => ({
  matches: true,
  addListener: () => {},
  removeListener: () => {}
});

const queriesMatchState = Object.keys(
  queries
).reduce((accumulator, currentKey) => {
  accumulator[currentKey] = true;
  return accumulator;
}, {});

module.exports = { queries, mockMatchMedia, queriesMatchState };
