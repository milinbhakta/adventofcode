import { readFile, writeFile } from "../../utils/file.js";

function parseMoves() {
  return readFile(new URL("./input.txt", import.meta.url));
}

// Part 1: Count times the dial ends at 0 after each full rotation.
function part1(input) {
  let dial = 50;
  let counter = 0;

  for (let i = 0; i < input.length; i++) {
    const direction = input[i].slice(0, 1);
    const distance = parseInt(input[i].slice(1), 10);

    if (direction === "R") {
      dial = (dial + distance) % 100;
    } else {
      dial = ((dial - distance) % 100 + 100) % 100;
    }

    if (dial === 0) {
      counter++;
    }
  }

  return counter;
}

// Part 2: Count every click that lands on 0 during each rotation.
function part2(input) {
  let dial = 50;
  let counter = 0;

  for (let i = 0; i < input.length; i++) {
    const direction = input[i].slice(0, 1);
    const distance = parseInt(input[i].slice(1), 10);

    if (direction === "R") {
      let firstHit = (100 - dial) % 100;
      if (firstHit === 0) {
        firstHit = 100;
      }
      if (distance >= firstHit) {
        counter += 1 + Math.floor((distance - firstHit) / 100);
      }
      dial = (dial + distance) % 100;
    } else {
      let firstHit = dial;
      if (firstHit === 0) {
        firstHit = 100;
      }
      if (distance >= firstHit) {
        counter += 1 + Math.floor((distance - firstHit) / 100);
      }
      dial = ((dial - distance) % 100 + 100) % 100;
    }
  }

  return counter;
}

const input = parseMoves();
const part1Result = part1(input);
const part2Result = part2(input);

writeFile(
  new URL("./output.txt", import.meta.url),
  `Part 1: ${part1Result}\nPart 2: ${part2Result}`
);
