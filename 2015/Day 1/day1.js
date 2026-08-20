import { readFile, writeFile } from "../../utils/file.js";

function parseMoves() {
  return readFile(new URL("./input.txt", import.meta.url), /\r?\n/, true);
}

function part1(input) {

  let floor = 0;

  for (const ch of input[0]) {
    if (ch === '(') {
      floor += 1;
    } else {
      floor -= 1;
    }
  }
  return floor
}


function part2(input) {

  let floor = 0;

  for (let i = 0; i < input[0].length; i++) {
    if (input[0][i] === '(') {
      floor += 1;
    } else {
      floor -= 1;
    }

    if (floor === -1) {
      return i + 1;
    }
  }
}

const input = parseMoves();
const part1Result = part1(input);
const part2Result = part2(input);

writeFile(
  new URL("./output.txt", import.meta.url),
  `Part 1: ${part1Result}\nPart 2: ${part2Result}`
);
