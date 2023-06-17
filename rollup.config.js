import babel from "@rollup/plugin-babel";
import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

const extensions = [".ts", ".js"];

export default [
  {
    input: "src/core/browser-tester/index.ts",
    preserveModules: false,

    output: {
      dir: "dist/browser-tester",
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
        declaration: true,
        rootDir: "src",
        declarationDir: "dist/browser-tester",
        tsconfig: "src/core/browser-tester/tsconfig.json",
      }),
    ],
  },
];
