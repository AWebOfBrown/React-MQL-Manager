import uglify from "rollup-plugin-uglify";
import babel from "rollup-plugin-babel";
import eslint from "rollup-plugin-eslint";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import { minify } from "uglify-es";

export default {
  input: "modules/index.js",
  external: ["react"],
  plugins: [
    babel({
      exclude: "node_modules/**",
      plugins: ["external-helpers"]
    }),
    eslint(),
    resolve(),
    commonjs(),
    uglify({}, minify)
  ],
  globals: {
    react: "React"
  },
  output: [
    {
      file: "./cjs/react-mql-manager.min.js",
      format: "cjs",
      exports: "named"
    },
    {
      file: "./es/react-mql-manager.min.js",
      format: "es"
    },
    {
      file: "./umd/react-mql-manager.min.js",
      format: "umd",
      name: "react-mql-manager"
    }
  ]
};
