import { defineConfig } from "tsup"
import { globbySync } from "globby"

export default defineConfig((options) => {
  return {
    entry: ["src/index.ts", ...globbySync("src/drivers/**/*.ts")],
    splitting: true,
    sourcemap: options.watch,
    minify: !options.watch,
    clean: true,
    format: ["esm", "cjs"],
    dts: true,
    target: "ES6",
    external: ["vue", "axios", "mitt", "vue-router", "pinia"],
  }
})
