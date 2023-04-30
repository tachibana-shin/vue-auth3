import { globbySync } from "globby"
import { defineConfig } from "tsup"

export default defineConfig(() => {
  return {
    entry: ["src/index.ts", ...globbySync("src/drivers/**/*.ts")],
    splitting: true,
    sourcemap: true,
    minify: false,
    clean: true,
    format: ["esm", "cjs"],
    dts: true,
    target: "ES6",
    external: ["vue", "axios", "mitt", "vue-router", "pinia"],
  }
})
