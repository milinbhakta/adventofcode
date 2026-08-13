import { readFile, writeFile } from "../utils/file.js";

function parseMoves() {
  return readFile(new URL("./input.txt", import.meta.url), /\r?\n/, false);
}

function part1(input) {
  const redTiles = input.map((line) => line.split(",").map(Number));
  let largestArea = 0;

  for (let firstTile = 0; firstTile < redTiles.length; firstTile++) {
    for (let secondTile = firstTile + 1; secondTile < redTiles.length; secondTile++) {
      const [firstX, firstY] = redTiles[firstTile];
      const [secondX, secondY] = redTiles[secondTile];
      const width = Math.abs(firstX - secondX) + 1;
      const height = Math.abs(firstY - secondY) + 1;
      const area = width * height;

      largestArea = Math.max(largestArea, area);
    }
  }

  return largestArea;
}

function part2(input) {
  const redTiles = input.map((line) => line.split(",").map(Number));
  let largestArea = 0;

  for (let firstTile = 0; firstTile < redTiles.length; firstTile++) {
    for (let secondTile = firstTile + 1; secondTile < redTiles.length; secondTile++) {
      const [firstX, firstY] = redTiles[firstTile];
      const [secondX, secondY] = redTiles[secondTile];
      const left = Math.min(firstX, secondX);
      const right = Math.max(firstX, secondX);
      const top = Math.min(firstY, secondY);
      const bottom = Math.max(firstY, secondY);
      const area = (right - left + 1) * (bottom - top + 1);

      if (area > largestArea && rectangleIsInsideLoop(left, right, top, bottom, redTiles)) {
        largestArea = area;
      }
    }
  }

  return largestArea;
}

function rectangleIsInsideLoop(left, right, top, bottom, redTiles) {
  const corners = [
    [left, top],
    [right, top],
    [left, bottom],
    [right, bottom],
  ];

  if (corners.some((corner) => !pointIsInsideLoop(corner[0], corner[1], redTiles))) {
    return false;
  }

  for (let tile = 0; tile < redTiles.length; tile++) {
    const nextTile = redTiles[(tile + 1) % redTiles.length];
    const [firstX, firstY] = redTiles[tile];
    const [secondX, secondY] = nextTile;

    if (firstY === secondY) {
      const edgeLeft = Math.min(firstX, secondX);
      const edgeRight = Math.max(firstX, secondX);
      const crossesInterior = firstY > top && firstY < bottom && edgeRight > left && edgeLeft < right;

      if (crossesInterior) {
        return false;
      }
    } else {
      const edgeTop = Math.min(firstY, secondY);
      const edgeBottom = Math.max(firstY, secondY);
      const crossesInterior = firstX > left && firstX < right && edgeBottom > top && edgeTop < bottom;

      if (crossesInterior) {
        return false;
      }
    }
  }

  return true;
}

function pointIsInsideLoop(x, y, redTiles) {
  let isInside = false;

  for (let tile = 0; tile < redTiles.length; tile++) {
    const nextTile = redTiles[(tile + 1) % redTiles.length];
    const [firstX, firstY] = redTiles[tile];
    const [secondX, secondY] = nextTile;

    if (
      (firstY === secondY && y === firstY && x >= Math.min(firstX, secondX) && x <= Math.max(firstX, secondX)) ||
      (firstX === secondX && x === firstX && y >= Math.min(firstY, secondY) && y <= Math.max(firstY, secondY))
    ) {
      return true;
    }

    if ((firstY > y) !== (secondY > y)) {
      const crossingX = firstX + ((y - firstY) * (secondX - firstX)) / (secondY - firstY);

      if (x < crossingX) {
        isInside = !isInside;
      }
    }
  }

  return isInside;
}

const input = parseMoves();
const part1Result = part1(input);
const part2Result = part2(input);

writeFile(
  new URL("./output.txt", import.meta.url),
  `Part 1: ${part1Result}\nPart 2: ${part2Result.toString()}\n`
);
