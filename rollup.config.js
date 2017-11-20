import uglify from "rollup-plugin-uglify";
import babel from "rollup-plugin-babel";
import eslint from "rollup-plugin-eslint";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";

export default {
  input: "modules/index.js",
  external: ["react"],
  plugins: [
    babel({
      exclude: "node_modules/**",
      plugins: ["external-helpers"]
    }),
    uglify(),
    eslint(),
    resolve(),
    commonjs()
  ],
  output: {
    file: "./cjs/react-mql-manager.min.js",
    format: "cjs",
    exports: "named"
  }
};
