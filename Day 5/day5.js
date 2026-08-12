import { readFile, writeFile } from "../utils/file.js";

function parseMoves() {
  return readFile(new URL("./input.txt", import.meta.url), /\r?\n/);
}

function part1(input) {
  const indexOfBlankLine = input.indexOf('');
  const ingredientsRanges = input
    .slice(0, indexOfBlankLine)
    .map((range) => range.split('-').map(BigInt));
  const ingredientsToCheck = input
    .slice(indexOfBlankLine + 1)
    .filter(Boolean);

  const freshCounter = ingredientsToCheck.filter((ingredient) => {
    const ingredientID = BigInt(ingredient);

    return ingredientsRanges.some(([startID, endID]) => (
      ingredientID >= startID && ingredientID <= endID
    ));
  }).length;

  return freshCounter.toString();
}

function part2(input) {
  const separator = input.indexOf('');
  const ranges = input
    .slice(0, separator)
    .map((range) => range.split('-').map(BigInt))
    .sort(([startA], [startB]) => (startA < startB ? -1 : 1));

  if (ranges.length === 0) {
    return '0';
  }

  let [currentStart, currentEnd] = ranges[0];
  let freshCount = 0n;

  for (const [start, end] of ranges.slice(1)) {
    if (start <= currentEnd + 1n) {
      currentEnd = end > currentEnd ? end : currentEnd;
      continue;
    }

    freshCount += currentEnd - currentStart + 1n;
    [currentStart, currentEnd] = [start, end];
  }

  freshCount += currentEnd - currentStart + 1n;
  return freshCount.toString();
}

const input = parseMoves();
const part1Result = part1(input);
const part2Result = part2(input);

writeFile(
  new URL("./output.txt", import.meta.url),
  `Part 1: ${part1Result}\nPart 2: ${part2Result.toString()}\n`
);
