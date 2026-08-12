import { readFile, writeFile } from "../utils/file.js";

function parseMoves() {
  return readFile(new URL("./input.txt", import.meta.url), /\r?\n/);
}

function part1(input) {
  let totalOutput = 0;

  for (let i = 0; i < input.length; i++) {
    const bank = input[i].toString().trim();

    if (bank.length < 2) {
      continue;
    }

    let maxFirstDigit = Number(bank[0]);
    let highestJoltage = Number.NEGATIVE_INFINITY;

    for (let j = 1; j < bank.length; j++) {
      const secondDigit = Number(bank[j]);
      const candidate = maxFirstDigit * 10 + secondDigit;

      if (candidate > highestJoltage) {
        highestJoltage = candidate;
      }

      if (secondDigit > maxFirstDigit) {
        maxFirstDigit = secondDigit;
      }
    }

    totalOutput += highestJoltage;
  }

  return totalOutput;
}

function part2(input) {
  let totalOutput = 0n;

  for (let i = 0; i < input.length; i++) {
    const bank = input[i].toString().trim();
    const requiredDigits = 12;

    if (bank.length < requiredDigits) {
      continue;
    }

    const stack = [];
    let removable = bank.length - requiredDigits;

    // Build the lexicographically largest subsequence while preserving order.
    for (let j = 0; j < bank.length; j++) {
      const digit = bank[j];

      while (
        removable > 0 &&
        stack.length > 0 &&
        stack[stack.length - 1] < digit
      ) {
        stack.pop();
        removable--;
      }

      stack.push(digit);
    }

    if (removable > 0) {
      stack.length -= removable;
    }

    const highestJoltage = BigInt(stack.slice(0, requiredDigits).join(""));
    totalOutput += highestJoltage;
  }

  return totalOutput;
}

const input = parseMoves();
const part1Result = part1(input);
const part2Result = part2(input);

writeFile(
  new URL("./output.txt", import.meta.url),
  `Part 1: ${part1Result}\nPart 2: ${part2Result.toString()}\n`
);
