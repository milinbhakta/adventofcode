import { readFile, writeFile } from "../../utils/file.js";

function parseMoves() {
  return readFile(new URL("./input.txt", import.meta.url));
}

function part1(input) {
  const devices = new Map();
  for (let i = 0; i < input.length; i++) {
    const colonIndex = input[i].indexOf(':');
    const key = input[i].slice(0, colonIndex).trim();
    const value = input[i].slice(colonIndex + 1).trim().split(' ');
    devices.set(key, value);
  }

  const pathCounts = new Map();

  function countPaths(device) {
    if (device === 'out') {
      return 1;
    }

    if (pathCounts.has(device)) {
      return pathCounts.get(device);
    }

    let totalPaths = 0;
    for (const output of devices.get(device) ?? []) {
      totalPaths += countPaths(output);
    }

    pathCounts.set(device, totalPaths);
    return totalPaths;
  }

  return countPaths('you');
}


function part2(input) {
  const devices = new Map();
  for (let i = 0; i < input.length; i++) {
    const colonIndex = input[i].indexOf(':');
    const key = input[i].slice(0, colonIndex).trim();
    const value = input[i].slice(colonIndex + 1).trim().split(' ');
    devices.set(key, value);
  }

  const pathCounts = new Map();

  function countPaths(device, visitedDac, visitedFft) {
    const hasVisitedDac = visitedDac || device === 'dac';
    const hasVisitedFft = visitedFft || device === 'fft';

    if (device === 'out') {
      return hasVisitedDac && hasVisitedFft ? 1 : 0;
    }

    const cacheKey = `${device},${hasVisitedDac},${hasVisitedFft}`;
    if (pathCounts.has(cacheKey)) {
      return pathCounts.get(cacheKey);
    }

    let totalPaths = 0;
    for (const output of devices.get(device) ?? []) {
      totalPaths += countPaths(output, hasVisitedDac, hasVisitedFft);
    }

    pathCounts.set(cacheKey, totalPaths);
    return totalPaths;
  }

  return countPaths('svr', false, false);
}

const input = parseMoves();
const part1Result = part1(input);
const part2Result = part2(input);

writeFile(
  new URL("./output.txt", import.meta.url),
  `Part 1: ${part1Result}\nPart 2: ${part2Result}`
);
