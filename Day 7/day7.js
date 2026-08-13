import { readFile, writeFile } from "../utils/file.js";

function parseMoves() {
  return readFile(new URL("./input.txt", import.meta.url), /\r?\n/, false);
}

function part1(input) {
  const startRow = input.findIndex((row) => row.includes("S"));
  let beamColumns = new Set([input[startRow].indexOf("S")]);
  let splitCount = 0;

  for (let rowIndex = startRow + 1; rowIndex < input.length; rowIndex += 1) {
    const row = input[rowIndex];
    for (const column of beamColumns) {
      if (row[column] === "^") {
        splitCount += 1;
      }
    }

    const nextBeamColumns = new Set();
    for (const column of beamColumns) {
      if (row[column] === "^") {
        nextBeamColumns.add(column - 1);
        nextBeamColumns.add(column + 1);
      } else {
        nextBeamColumns.add(column);
      }
    }

    beamColumns = nextBeamColumns;
  }

  return splitCount;
}

function part2(input) {
  const startRow = input.findIndex((row) => row.includes("S"));
  const startColumn = input[startRow].indexOf("S");
  let timelineCounts = new Map([[startColumn, 1n]]);

  for (let rowIndex = startRow + 1; rowIndex < input.length; rowIndex += 1) {
    const row = input[rowIndex];
    const nextTimelineCounts = new Map();

    for (const [column, timelineCount] of timelineCounts) {
      const nextColumns = row[column] === "^"
        ? [column - 1, column + 1]
        : [column];

      for (const nextColumn of nextColumns) {
        const previousCount = nextTimelineCounts.get(nextColumn) ?? 0n;
        nextTimelineCounts.set(nextColumn, previousCount + timelineCount);
      }
    }

    timelineCounts = nextTimelineCounts;
  }

  let totalTimelines = 0n;
  for (const timelineCount of timelineCounts.values()) {
    totalTimelines += timelineCount;
  }

  return totalTimelines;
}

const input = parseMoves();
const part1Result = part1(input);
const part2Result = part2(input);

writeFile(
  new URL("./output.txt", import.meta.url),
  `Part 1: ${part1Result}\nPart 2: ${part2Result.toString()}\n`
);
