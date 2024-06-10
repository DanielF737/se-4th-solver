import {
  Dissect,
  Inside,
  Instruction,
  Outside,
  Shapes,
  Shapes3d,
  doubleShapes,
  mappings,
  numberToSideMapping,
  sideToNumberMapping,
} from '../types';

export function solver(inside: Inside, outside: Outside) {
  try {
    const instructions: Instruction[] = [];
    let outsideState: Outside = [...outside];

    while (true) {
      const instruction = step(inside, outsideState);

      if (!instruction) break;

      instructions.push(instruction);
      outsideState = applyInstruction(instruction, outsideState);
    }

    return instructions;
  } catch (e) {
    console.error(e);
    return [];
  }
}

function step(inside: Inside, outside: Outside): Instruction | null {
  const intstructions: Dissect[] = [];
  outside.forEach((shape3d, index) => {
    // check if its a combo of two of the same shape - these always need to be broken up
    if (doubleShapes.includes(shape3d)) {
      intstructions.push([numberToSideMapping[index], mappings[shape3d][0]]);
    } else if (mappings[shape3d].includes(inside[index])) {
      intstructions.push([numberToSideMapping[index], inside[index]]);
    }
  });

  const firstTwoElements = intstructions.slice(0, 2);
  if (isInstruction(firstTwoElements)) {
    return firstTwoElements;
  }

  return null;
}

function isInstruction(arr: Dissect[]): arr is Instruction {
  return arr.length === 2;
}

function applyInstruction(
  instruction: Instruction,
  outsideState: Outside
): Outside {
  const arr: Outside = [...outsideState];
  const sideA = sideToNumberMapping[instruction[0][0]];
  const sideB = sideToNumberMapping[instruction[1][0]];

  const shapeA = instruction[0][1];
  const shapeB = instruction[1][1];

  arr[sideA] = update3dShape(arr[sideA], shapeB, shapeA);
  arr[sideB] = update3dShape(arr[sideB], shapeA, shapeB);

  return arr;
}

function update3dShape(
  shape3d: Shapes3d,
  add: Shapes,
  subtract: Shapes
): Shapes3d {
  const shapeComponents: [Shapes, Shapes] = [...mappings[shape3d]];

  // remove only one instance of subtract
  removeFirstInstance(shapeComponents, subtract);

  // add a single instance of add
  shapeComponents.push(add);

  return findNewShape(shapeComponents);
}

function findNewShape(shapes: [Shapes, Shapes]): Shapes3d {
  const newShape = Object.entries(mappings).find(([key, value]) => {
    const ns = [...value];
    removeFirstInstance(ns, shapes[0]);
    removeFirstInstance(ns, shapes[1]);
    return ns.length === 0;
  })?.[0] as Shapes3d;
  if (!newShape) {
    throw new Error(`No shape found for ${shapes.join(', ')}`);
  }
  return newShape;
}

function removeFirstInstance<T>(arr: T[], str: T): T[] {
  const index = arr.indexOf(str);
  if (index !== -1) {
    arr.splice(index, 1);
  }
  return arr;
}

export function checkInvalid(inside: Inside, outside: Outside): boolean {
  // Check that all 3 elements of inside are different
  const uniqueInside = new Set(inside);
  if (uniqueInside.size !== 3) return false;

  // convert outside to an array of its mappings
  const outsideArray = outside.flatMap((shape3d) => mappings[shape3d]);

  // Check that each value appears exactly twice
  const outsideCount = outsideArray.reduce(
    (acc, curr) => {
      acc[curr] = (acc[curr] || 0) + 1;
      return acc;
    },
    {} as Record<Shapes, number>
  );
  return Object.values(outsideCount).every((count) => count === 2);
}
