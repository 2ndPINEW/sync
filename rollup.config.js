import babel from "@rollup/plugin-babel";
import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

const extensions = [".ts", ".js"];

export default [
  {
    input: "src/core/browser-tester-client/index.ts",
    preserveModules: false,

    output: {
      dir: "dist/browser-tester-client",
      format: "cjs",
      exports: "named",
      sourcemap: false,
    },
    plugins: [
      commonjs(),
      nodeResolve(),
      babel({
        extensions,
      }),
      typescript({
        rootDir: "src/core/",
        declarationDir: "dist/browser-tester-client",
        tsconfig: "tsconfig.browser.json",
      }),
    ],
  },
];
