module.exports = {
  verbose: true,
  testEnvironment: "jsdom",
  testMatch: [
    "**/__tests__/unit/*.(test|spec).js?(x)",
    "**/__tests__/integration/(clientSide|serverSide)/*.(test|spec).js?(x)"
  ],
  notify: true
};
