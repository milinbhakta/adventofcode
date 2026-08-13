import { readFile, writeFile } from "../../utils/file.js";

function parseMoves() {
  return readFile(new URL("./input.txt", import.meta.url), /\r?\n/, false);
}

function part1(input) {
  const rows = input.length;
  const operatorRow = rows - 1;
  const rowValues = {};

  for (let row = rows - 1; row >= 0; row -= 1) {
    rowValues[row] = [];
    let startIndex = 0;

    for (let column = 0; column <= input[row].length; column += 1) {
      if (column === input[row].length || input[row][column] === " ") {
        const value = input[row].slice(startIndex, column).trim();
        if (value !== "") {
          rowValues[row].push(value);
        }
        startIndex = column + 1;
      }
    }
  }

  const results = [];
  for (let problem = 0; problem < rowValues[operatorRow].length; problem += 1) {
    const operation = rowValues[operatorRow][problem];
    let result = operation === "*" ? 1 : 0;

    for (let row = 0; row < operatorRow; row += 1) {
      const value = Number(rowValues[row][problem]);
      result = operation === "*" ? result * value : result + value;
    }

    results.push(result);
  }

  return results.reduce((total, result) => total + result, 0);
}

function part2(input) {
  const rows = input.length;
  const operatorRow = rows - 1;
  const width = Math.max(...input.map((row) => row.length));
  const rowValues = {};

  for (let row = 0; row < rows; row += 1) {
    rowValues[row] = input[row].padEnd(width, " ").split("");
  }

  const problemRanges = [];
  let start = 0;

  for (let column = 0; column <= width; column += 1) {
    let separator = column === width;

    if (!separator) {
      separator = true;
      for (let row = 0; row < rows; row += 1) {
        if (rowValues[row][column] !== " ") {
          separator = false;
          break;
        }
      }
    }

    if (separator) {
      if (start < column) {
        problemRanges.push([start, column]);
      }
      start = column + 1;
    }
  }

  let grandTotal = 0n;

  for (const [from, to] of problemRanges) {
    let operation = "";
    for (let column = from; column < to; column += 1) {
      if (rowValues[operatorRow][column] === "+" || rowValues[operatorRow][column] === "*") {
        operation = rowValues[operatorRow][column];
        break;
      }
    }

    let problemResult = operation === "*" ? 1n : 0n;

    for (let column = to - 1; column >= from; column -= 1) {
      let numberText = "";

      for (let row = 0; row < operatorRow; row += 1) {
        const character = rowValues[row][column];
        if (character >= "0" && character <= "9") {
          numberText += character;
        }
      }

      if (numberText !== "") {
        const number = BigInt(numberText);
        problemResult = operation === "*"
          ? problemResult * number
          : problemResult + number;
      }
    }

    grandTotal += problemResult;
  }

  return grandTotal;
}

const input = parseMoves();
const part1Result = part1(input);
const part2Result = part2(input);

writeFile(
  new URL("./output.txt", import.meta.url),
  `Part 1: ${part1Result}\nPart 2: ${part2Result.toString()}\n`
);
