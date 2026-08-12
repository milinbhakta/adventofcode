// Read File from the path

import fs from "fs";
import { fileURLToPath } from "url";

export function readFile(path, splitpattern = /\r?\n/, trimFile = true) {
  const filePath = path instanceof URL ? fileURLToPath(path) : path;

  if (fs.existsSync(filePath)) {
    const contents = fs.readFileSync(filePath, "utf8");
    return (trimFile ? contents.trim() : contents.replace(/\r?\n$/, "")).split(splitpattern);
  }

  return [];
}

export function writeFile(path, data) {
  const filePath = path instanceof URL ? fileURLToPath(path) : path;

  fs.writeFileSync(filePath, String(data), "utf8");
}
