import { readFile, writeFile } from "../../utils/file.js";

function parseMoves() {
  return readFile(new URL("./input.txt", import.meta.url), /\r?\n/);
}

function part1(input) {
  const directions = [-1, 0, 1];
  let accessibleRolls = 0;

  for (let row = 0; row < input.length; row += 1) {
    for (let column = 0; column < input[row].length; column += 1) {
      if (input[row][column] !== "@") {
        continue;
      }

      let adjacentRolls = 0;

      for (const rowOffset of directions) {
        for (const columnOffset of directions) {
          if (rowOffset === 0 && columnOffset === 0) {
            continue;
          }

          const adjacentRow = row + rowOffset;
          const adjacentColumn = column + columnOffset;

          if (input[adjacentRow]?.[adjacentColumn] === "@") {
            adjacentRolls += 1;
          }
        }
      }

      if (adjacentRolls < 4) {
        accessibleRolls += 1;
      }
    }
  }

  return accessibleRolls;
}

function part2(input) {
  const directions = [-1, 0, 1];
  const grid = input.map((row) => row.split(""));
  let removedRolls = 0;

  while (true) {
    const removableRolls = [];

    for (let row = 0; row < grid.length; row += 1) {
      for (let column = 0; column < grid[row].length; column += 1) {
        if (grid[row][column] !== "@") {
          continue;
        }

        let adjacentRolls = 0;

        for (const rowOffset of directions) {
          for (const columnOffset of directions) {
            if (rowOffset === 0 && columnOffset === 0) {
              continue;
            }

            const adjacentRow = row + rowOffset;
            const adjacentColumn = column + columnOffset;

            if (grid[adjacentRow]?.[adjacentColumn] === "@") {
              adjacentRolls += 1;
            }
          }
        }

        if (adjacentRolls < 4) {
          removableRolls.push([row, column]);
        }
      }
    }

    if (removableRolls.length === 0) {
      break;
    }

    for (const [row, column] of removableRolls) {
      grid[row][column] = ".";
    }

    removedRolls += removableRolls.length;
  }

  return removedRolls;
}

const input = parseMoves();
const part1Result = part1(input);
const part2Result = part2(input);

writeFile(
  new URL("./output.txt", import.meta.url),
  `Part 1: ${part1Result}\nPart 2: ${part2Result.toString()}\n`
);
