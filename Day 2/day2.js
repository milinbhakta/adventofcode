import { readFile, writeFile } from "../utils/file.js";

function parseMoves() {
  return readFile(new URL("./input.txt", import.meta.url), /\r?,/);
}

function part1(input) {
  let sumofallInvalidIds = 0;
  const repeatedSequenceRegex = /^(\d+)\1$/;

  for (let i = 0; i < input.length; i++) {
    const [firstIDText, secondIDText] = input[i].split("-");
    const firstID = parseInt(firstIDText, 10);
    const secondID = parseInt(secondIDText, 10);

    for (let id = firstID; id <= secondID; id++) {
      if (repeatedSequenceRegex.test(id.toString())) {
        sumofallInvalidIds += id;
      }
    }
  }

  return sumofallInvalidIds;
}

function part2(input) {
  let sumofallInvalidIds = 0;
  const repeatedSequenceRegex = /^(\d+)\1+$/;

  for (let i = 0; i < input.length; i++) {
    const [firstIDText, secondIDText] = input[i].split("-");
    const firstID = parseInt(firstIDText, 10);
    const secondID = parseInt(secondIDText, 10);

    for (let id = firstID; id <= secondID; id++) {
      if (repeatedSequenceRegex.test(id.toString())) {
        sumofallInvalidIds += id;
      }
    }
  }

  return sumofallInvalidIds;
}

const input = parseMoves();
const part1Result = part1(input);
const part2Result = part2(input);

writeFile(
  new URL("./output.txt", import.meta.url),
  `Part 1: ${part1Result}\nPart 2: ${part2Result}`
);
