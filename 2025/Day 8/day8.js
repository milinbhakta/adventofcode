import { readFile, writeFile } from "../../utils/file.js";

function parseMoves() {
  return readFile(new URL("./input.txt", import.meta.url), /\r?\n/, false);
}

function part1(input) {
  const jposition = input.map((position) => position.split(',').map(Number));
  const connections = [];

  const getDistanceSquared = ([x1, y1, z1], [x2, y2, z2]) => {
    return ((x2 - x1) * (x2 - x1)) +
      ((y2 - y1) * (y2 - y1)) +
      ((z2 - z1) * (z2 - z1));
  };

  for (let firstIndex = 0; firstIndex < jposition.length - 1; firstIndex += 1) {
    for (let secondIndex = firstIndex + 1; secondIndex < jposition.length; secondIndex += 1) {
      connections.push({
        firstIndex,
        secondIndex,
        distance: getDistanceSquared(jposition[firstIndex], jposition[secondIndex]),
      });
    }
  }

  connections.sort((first, second) => first.distance - second.distance);

  const parents = jposition.map((_, index) => index);
  const sizes = jposition.map(() => 1);

  const find = (index) => {
    if (parents[index] !== index) {
      parents[index] = find(parents[index]);
    }

    return parents[index];
  };

  const union = (firstIndex, secondIndex) => {
    let firstRoot = find(firstIndex);
    let secondRoot = find(secondIndex);

    if (firstRoot === secondRoot) {
      return;
    }

    if (sizes[firstRoot] < sizes[secondRoot]) {
      [firstRoot, secondRoot] = [secondRoot, firstRoot];
    }

    parents[secondRoot] = firstRoot;
    sizes[firstRoot] += sizes[secondRoot];
  };

  for (const { firstIndex, secondIndex } of connections.slice(0, 1000)) {
    union(firstIndex, secondIndex);
  }

  return sizes
    .filter((size, index) => parents[index] === index)
    .sort((first, second) => second - first)
    .slice(0, 3)
    .reduce((product, size) => product * size, 1);
}

function part2(input) {
  const jposition = input.map((position) => position.split(',').map(Number));
  const connections = [];

  const getDistanceSquared = ([x1, y1, z1], [x2, y2, z2]) => {
    return ((x2 - x1) * (x2 - x1)) +
      ((y2 - y1) * (y2 - y1)) +
      ((z2 - z1) * (z2 - z1));
  };

  for (let firstIndex = 0; firstIndex < jposition.length - 1; firstIndex += 1) {
    for (let secondIndex = firstIndex + 1; secondIndex < jposition.length; secondIndex += 1) {
      connections.push({
        firstIndex,
        secondIndex,
        distance: getDistanceSquared(jposition[firstIndex], jposition[secondIndex]),
      });
    }
  }

  connections.sort((first, second) => first.distance - second.distance);

  const parents = jposition.map((_, index) => index);
  const sizes = jposition.map(() => 1);
  let circuitCount = jposition.length;

  const find = (index) => {
    if (parents[index] !== index) {
      parents[index] = find(parents[index]);
    }

    return parents[index];
  };

  for (const { firstIndex, secondIndex } of connections) {
    let firstRoot = find(firstIndex);
    let secondRoot = find(secondIndex);

    if (firstRoot === secondRoot) {
      continue;
    }

    if (sizes[firstRoot] < sizes[secondRoot]) {
      [firstRoot, secondRoot] = [secondRoot, firstRoot];
    }

    parents[secondRoot] = firstRoot;
    sizes[firstRoot] += sizes[secondRoot];
    circuitCount -= 1;

    if (circuitCount === 1) {
      return jposition[firstIndex][0] * jposition[secondIndex][0];
    }
  }

  return 0;
}

const input = parseMoves();
const part1Result = part1(input);
const part2Result = part2(input);

writeFile(
  new URL("./output.txt", import.meta.url),
  `Part 1: ${part1Result}\nPart 2: ${part2Result.toString()}\n`
);
