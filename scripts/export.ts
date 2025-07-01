/// <reference types="@types/node" />
import fs from 'fs';
import path from 'path';

const basePath = path.resolve(__dirname);
const distDriversDir = path.join(basePath, '../dist', 'drivers');
const packageJsonPath = path.join(basePath, '../package.json');
const packageJson = require(packageJsonPath);

packageJson.exports = {
  ".": {
    "import": "./dist/index.mjs",
    "require": "./dist/index.js",
    "types": "./dist/index.d.ts"
  },
  "./dist/": "./dist/"
};

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.mjs')) {
      const relativePath = path.relative(distDriversDir, fullPath); // e.g. auth/basic.mjs
      const modulePath = relativePath.replace(/\.mjs$/, ''); // e.g. auth/basic
      const exportKey = `./drivers/${modulePath}`;
      packageJson.exports[exportKey] = {
        "import": `./dist/drivers/${modulePath}.mjs`,
        "require": `./dist/drivers/${modulePath}.js`,
        "types": `./dist/drivers/${modulePath}.d.ts`
      };
    }
  }
}

walk(distDriversDir);

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
console.log("✅ Generated 'exports' for drivers/*");