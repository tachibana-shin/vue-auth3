import commonjs from "rollup-plugin-commonjs";
import dts from "rollup-plugin-dts";
import esbuild from "rollup-plugin-esbuild";
import resolve from "rollup-plugin-node-resolve";
// import { terser } from "rollup-plugin-terser";

import { name, version } from "./package.json";

const banner = `/**
 * This library created by Tachibana Shin <45375496+tachibana-shin@users.noreply.github.com> (c) ${new Date().getFullYear()}
 * MIT License
 * ${name} version ${version}
 * */`;

const options = [
  {
    input: "src/index.ts",
    plugins: [
      esbuild({
        // All options are optional
        include: /\.ts$/,
        exclude: /node_modules/, // default
        sourceMap: false, // default
        minify: false,
        target: "es2017", // default, or 'es20XX', 'esnext'
        jsx: "transform", // default, or 'preserve'
        // Like @rollup/plugin-replace
        define: {
          __VERSION__: `"${version}"`,
        },
        tsconfig: "./tsconfig.json", // default
        // Add extra loaders
        loaders: {
          // Add .json files support
          // require @rollup/plugin-commonjs
          ".json": "json",
        },
      }),
      resolve({
        browser: true,
        preferBuiltins: false,
      }),
      commonjs(),
    ],
    output: [
      {
        file: `dist/${name}.umd.js`,
        format: "umd",
        plugins: [],
        name: `${name}`,
        banner,
        strict: true,
      },
      // {
      //   file: `dist/${name}.umd.min.js`,
      //   format: "umd",
      //   plugins: [terser()],
      //   name: `${name}`,
      // },
      {
        file: `dist/${name}.esm.js`,
        format: "esm",
        plugins: [],
        exports: "auto",
        banner,
        strict: true,
      },
      // {
      //   file: `dist/${name}.esm.min.js`,
      //   format: "esm",
      //   plugins: [terser()],
      //   exports: "auto",
      // },
    ],
  },
  {
    input: "src/index.ts",
    plugins: [
      esbuild({
        // All options are optional
        include: /\.ts$/,
        exclude: /node_modules/, // default
        sourceMap: false, // default
        minify: true,
        target: "es2017", // default, or 'es20XX', 'esnext'
        jsx: "transform", // default, or 'preserve'
        // Like @rollup/plugin-replace
        define: {
          __VERSION__: `"${version}"`,
        },
        tsconfig: "./tsconfig.json", // default
        // Add extra loaders
        loaders: {
          // Add .json files support
          // require @rollup/plugin-commonjs
          ".json": "json",
        },
      }),
      resolve({
        browser: true,
        preferBuiltins: false,
      }),
      commonjs(),
    ],
    output: [
      {
        file: `dist/${name}.umd.min.js`,
        format: "umd",
        plugins: [],
        name: `${name}`,
        banner,
        strict: true,
      },
      {
        file: `dist/${name}.esm.min.js`,
        format: "esm",
        plugins: [],
        exports: "auto",
        banner,
        strict: true,
      },
    ],
  },
  {
    input: "src/index.ts",
    output: [
      {
        file: `dist/${name}.d.ts`,
        format: "es",
      },
    ],
    plugins: [dts()],
  },
];

export default options;
