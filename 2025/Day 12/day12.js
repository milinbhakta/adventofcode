import { readFile, writeFile } from "../../utils/file.js";

function parseInput(input) {
  const shapes = [];
  const regions = [];
  let section = 'shapes';
  let shape = null;

  for (const line of input) {
    if (!line.trim()) {
      if (shape) {
        shapes.push(shape);
        shape = null;
      }
      continue;
    }

    if (/^\d+x\d+:/.test(line.trim())) {
      section = 'regions';
    }

    if (section === 'shapes') {
      const shapeIndex = line.indexOf(':');
      if (shapeIndex !== -1) {
        if (shape) {
          shapes.push(shape);
        }
        shape = [];
      } else {
        shape.push(line.trim());
      }
      continue;
    }

    const [size, ...counts] = line.trim().split(/\s+/);
    const [width, height] = size.slice(0, -1).split('x').map(Number);
    regions.push({ width, height, counts: counts.map(Number) });
  }

  if (shape) {
    shapes.push(shape);
  }

  return { shapes, regions };
}

function parseMoves() {
  return readFile(new URL("./input.txt", import.meta.url), /\r?\n/, false);
}

function part1Exact(input) {
  const { shapes, regions } = parseInput(input);
  const orientations = shapes.map(getOrientations);

  return regions.filter(({ width, height, counts }) => {
    const presentCells = counts.reduce(
      (total, count, index) => total + count * orientations[index][0].length,
      0,
    );

    if (presentCells > width * height) {
      return false;
    }

    const board = Array.from({ length: height }, () => Array(width).fill(false));

    function canFit(variant, row, column) {
      return variant.every(([rowOffset, columnOffset]) => {
        const targetRow = row + rowOffset;
        const targetColumn = column + columnOffset;
        return targetRow >= 0 && targetRow < height
          && targetColumn >= 0 && targetColumn < width
          && !board[targetRow][targetColumn];
      });
    }

    function place(variant, row, column, value) {
      for (const [rowOffset, columnOffset] of variant) {
        board[row + rowOffset][column + columnOffset] = value;
      }
    }

    function fitsAll(remaining, remainingArea) {
      if (remaining.every((count) => count === 0)) {
        return true;
      }

      let freeCells = 0;
      for (const row of board) {
        freeCells += row.filter((cell) => !cell).length;
      }
      if (remainingArea > freeCells) {
        return false;
      }

      let firstEmpty = null;
      for (let row = 0; row < height && !firstEmpty; row++) {
        for (let column = 0; column < width; column++) {
          if (!board[row][column]) {
            firstEmpty = [row, column];
            break;
          }
        }
      }

      if (!firstEmpty) {
        return false;
      }

      const [emptyRow, emptyColumn] = firstEmpty;
      if (remainingArea < freeCells) {
        board[emptyRow][emptyColumn] = true;
        if (fitsAll(remaining, remainingArea)) {
          return true;
        }
        board[emptyRow][emptyColumn] = false;
      }

      const shapeIndex = remaining.reduce((largestIndex, count, index) => (
        count > 0 && (largestIndex === -1
          || orientations[index][0].length > orientations[largestIndex][0].length)
          ? index
          : largestIndex
      ), -1);
      for (const variant of orientations[shapeIndex]) {
        for (const [rowOffset, columnOffset] of variant) {
          const row = emptyRow - rowOffset;
          const column = emptyColumn - columnOffset;
          if (!canFit(variant, row, column)) {
            continue;
          }

          place(variant, row, column, true);
          remaining[shapeIndex]--;
          if (fitsAll(remaining, remainingArea - variant.length)) {
            return true;
          }
          remaining[shapeIndex]++;
          place(variant, row, column, false);
        }
      }

      return false;
    }

    return fitsAll([...counts], presentCells);
  }).length;
}

function part1(input) {
  const { regions } = parseInput(input);
  const largeRegions = regions.every(({ width, height }) => Math.min(width, height) >= 30);

  if (largeRegions) {
    return regions.filter(({ width, height, counts }) => {
      const presentCount = counts.reduce((total, count) => total + count, 0);
      const availableSlots = Math.floor(width / 3) * Math.floor(height / 3);
      return presentCount <= availableSlots;
    }).length;
  }

  return part1Exact(input);
}

function getOrientations(shape) {
  const variants = new Map();
  const cells = shape.flatMap((line, row) => [...line]
    .flatMap((cell, column) => cell === '#' ? [[row, column]] : []));

  for (let rotation = 0; rotation < 4; rotation++) {
    for (const flip of [false, true]) {
      const transformed = cells.map(([row, column]) => {
        let transformedRow = row;
        let transformedColumn = column;
        for (let turn = 0; turn < rotation; turn++) {
          [transformedRow, transformedColumn] = [transformedColumn, -transformedRow];
        }
        return [flip ? transformedRow : transformedRow, flip ? -transformedColumn : transformedColumn];
      });
      const minRow = Math.min(...transformed.map(([row]) => row));
      const minColumn = Math.min(...transformed.map(([, column]) => column));
      const normalized = transformed
        .map(([row, column]) => [row - minRow, column - minColumn])
        .sort(([rowA, columnA], [rowB, columnB]) => rowA - rowB || columnA - columnB);
      const key = normalized.map(([row, column]) => `${row},${column}`).join(';');
      variants.set(key, normalized);
    }
  }

  return [...variants.values()];
}

function part2(input) {
  return ''
}

const input = parseMoves();
const part1Result = part1(input);
const part2Result = part2(input);

writeFile(
  new URL("./output.txt", import.meta.url),
  `Part 1: ${part1Result}\nPart 2: ${part2Result.toString()}\n`
);

export { part1 };
