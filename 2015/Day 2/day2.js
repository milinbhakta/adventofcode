import { readFile, writeFile } from "../../utils/file.js";

function parseMoves() {
  return readFile(new URL("./input.txt", import.meta.url), /\r?\n/, true);
}

function getSurfaceAreaandSlack([l, w, h]) {
  const area = (2 * l * w + 2 * w * h + 2 * h * l);
  const slack = l * w;

  return area + slack;
}

function getRibbonfeet([l, w, h]) {
  let wrapRibbon = l + l + w + w;
  let bowRibbon = l * w * h;
  let total = wrapRibbon + bowRibbon;

  return total;
}

function part1(input) {
  let sum = 0;

  for (let i = 0; i < input.length; i++) {
    const sides = input[i].split('x').sort((a, b) => parseInt(a) - parseInt(b)).map((v) => parseInt(v));
    let area = getSurfaceAreaandSlack(sides)

    sum += area;
  }
  return sum;
}


function part2(input) {
  let sum = 0;

  for (let i = 0; i < input.length; i++) {
    const sides = input[i].split('x').sort((a, b) => parseInt(a) - parseInt(b)).map((v) => parseInt(v));
    let total = getRibbonfeet(sides)

    sum += total
  }
  return sum;
}

const input = parseMoves();
const part1Result = part1(input);
const part2Result = part2(input);

writeFile(
  new URL("./output.txt", import.meta.url),
  `Part 1: ${part1Result}\nPart 2: ${part2Result}`
);
