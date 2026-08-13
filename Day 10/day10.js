import { readFile, writeFile } from "../utils/file.js";

function parseMoves() {
  return readFile(new URL("./input.txt", import.meta.url));
}

function part1(input) {
  let totalPresses = 0;

  for (const line of input) {
    // Every line describes one machine. The joltage values are also present,
    // but Part 1 only needs the target lights and the button wiring.
    const lightDiagram = line.match(/\[([.#]+)\]/)[1];
    const buttonMatches = line.match(/\([^)]*\)/g) || [];

    // Convert the target diagram into true and false values. For example,
    // "#." becomes [true, false], because the machine starts with all lights off.
    const targetLights = lightDiagram.split("").map((light) => light === "#");

    // Remove the parentheses and turn each button's light numbers into an array.
    // For example, "(0,2)" becomes [0, 2].
    const buttons = buttonMatches.map((button) =>
      button
        .slice(1, -1)
        .split(",")
        .map(Number)
    );
    let fewestPresses = Infinity;

    // Try every possible group of buttons. Each button only needs to be pressed
    // zero or one time because pressing it twice would undo its first press.
    const numberOfCombinations = 2 ** buttons.length;

    for (let combination = 0; combination < numberOfCombinations; combination++) {
      // Start this attempt with every light turned off, just like the machine.
      const lights = targetLights.map(() => false);
      let presses = 0;

      for (let buttonIndex = 0; buttonIndex < buttons.length; buttonIndex++) {
        // Each binary digit in combination tells us whether to press one button.
        // A 1 means press it; a 0 means leave it alone.
        const buttonIsPressed = (combination & (1 << buttonIndex)) !== 0;

        if (!buttonIsPressed) {
          continue;
        }

        presses++;
        for (const lightIndex of buttons[buttonIndex]) {
          // Pressing a button flips every light connected to that button.
          lights[lightIndex] = !lights[lightIndex];
        }
      }

      // If the lights now match the diagram, remember this attempt if it is
      // better than the best solution found for this machine so far.
      if (lights.every((light, index) => light === targetLights[index])) {
        fewestPresses = Math.min(fewestPresses, presses);
      }
    }

    totalPresses += fewestPresses;
  }

  return totalPresses;
}

function part2(input) {
  let totalPresses = 0;

  for (const line of input) {
    // Part 2 ignores the light diagram and uses the numbers inside braces.
    const buttonMatches = line.match(/\([^)]*\)/g) || [];
    const joltageText = line.match(/\{([^}]+)\}/)[1];
    const targetJoltage = joltageText.split(",").map(Number);
    const buttons = buttonMatches.map((button) =>
      button
        .slice(1, -1)
        .split(",")
        .map(Number)
    );

    // Make one equation for each counter. A 1 means that a button increases
    // that counter, and a 0 means that it does not.
    const equations = targetJoltage.map((target, counterIndex) => [
      ...buttons.map((button) => button.includes(counterIndex) ? 1 : 0),
      target,
    ]);

    // Simplify the equations so that some button counts can be calculated
    // from the remaining button counts. This is ordinary Gaussian elimination.
    const pivotColumns = [];
    let pivotRow = 0;
    for (let column = 0; column < buttons.length && pivotRow < equations.length; column++) {
      let bestRow = pivotRow;
      for (let row = pivotRow + 1; row < equations.length; row++) {
        if (Math.abs(equations[row][column]) > Math.abs(equations[bestRow][column])) {
          bestRow = row;
        }
      }

      if (Math.abs(equations[bestRow][column]) < 0.0000001) {
        continue;
      }

      [equations[pivotRow], equations[bestRow]] = [equations[bestRow], equations[pivotRow]];
      const divisor = equations[pivotRow][column];
      for (let currentColumn = column; currentColumn <= buttons.length; currentColumn++) {
        equations[pivotRow][currentColumn] /= divisor;
      }

      for (let row = 0; row < equations.length; row++) {
        if (row === pivotRow) {
          continue;
        }

        const multiplier = equations[row][column];
        for (let currentColumn = column; currentColumn <= buttons.length; currentColumn++) {
          equations[row][currentColumn] -= multiplier * equations[pivotRow][currentColumn];
        }
      }

      pivotColumns.push(column);
      pivotRow++;
    }

    const freeColumns = buttons
      .map((_, column) => column)
      .filter((column) => !pivotColumns.includes(column));
    const buttonLimits = buttons.map((button) => {
      if (button.length === 0) {
        return 0;
      }

      return Math.min(...button.map((counterIndex) => targetJoltage[counterIndex]));
    });
    let fewestPresses = Infinity;

    // Try the possible counts for only the free buttons. The pivot button
    // counts are worked out by the simplified equations below.
    function tryFreeButtonCounts(freeButtonIndex, buttonPresses) {
      if (freeButtonIndex < freeColumns.length) {
        const column = freeColumns[freeButtonIndex];
        for (let presses = 0; presses <= buttonLimits[column]; presses++) {
          buttonPresses[column] = presses;
          tryFreeButtonCounts(freeButtonIndex + 1, buttonPresses);
        }
        return;
      }

      // Calculate every pivot button count from the current free button counts.
      for (let row = 0; row < pivotColumns.length; row++) {
        const pivotColumn = pivotColumns[row];
        let presses = equations[row][buttons.length];
        for (const column of freeColumns) {
          presses -= equations[row][column] * buttonPresses[column];
        }

        const roundedPresses = Math.round(presses);
        if (Math.abs(presses - roundedPresses) > 0.0000001 || roundedPresses < 0) {
          return;
        }

        buttonPresses[pivotColumn] = roundedPresses;
      }

      // Check the original equations and count the presses for this solution.
      const counters = targetJoltage.map(() => 0);
      for (let buttonIndex = 0; buttonIndex < buttons.length; buttonIndex++) {
        if (buttonPresses[buttonIndex] > buttonLimits[buttonIndex]) {
          return;
        }

        for (const counterIndex of buttons[buttonIndex]) {
          counters[counterIndex] += buttonPresses[buttonIndex];
        }
      }

      if (counters.every((counter, index) => counter === targetJoltage[index])) {
        const presses = buttonPresses.reduce((total, count) => total + count, 0);
        fewestPresses = Math.min(fewestPresses, presses);
      }
    }

    tryFreeButtonCounts(0, buttons.map(() => 0));
    totalPresses += fewestPresses;
  }

  return totalPresses;
}

const input = parseMoves();
const part1Result = part1(input);
const part2Result = part2(input);

writeFile(
  new URL("./output.txt", import.meta.url),
  `Part 1: ${part1Result}\nPart 2: ${part2Result}`
);
