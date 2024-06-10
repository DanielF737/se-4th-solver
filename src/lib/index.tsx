import {
  Dissect,
  Inside,
  Instruction,
  Outside,
  Shapes,
  Shapes3d,
  mappings,
  numberToSideMapping,
  sideToNumberMapping,
} from '../types';

export function solver(inside: Inside, outside: Outside) {
  try {
    const instructions: Instruction[] = [];
    let outsideState: Outside = [...outside];

    while (true) {
      const instruction = step(inside, outside);

      if (!instruction) break;

      instructions.push(instruction);
      outsideState = applyInstruction(instruction, outsideState);
    }

    return instructions;
  } catch (e) {
    return null;
  }
}

function step(inside: Inside, outside: Outside): Instruction | null {
  const intstructions: Dissect[] = [];
  outside.forEach((shape3d, index) => {
    if (mappings[shape3d].includes(inside[index])) {
      intstructions.push([numberToSideMapping[index], inside[index]]);
    }
  });

  if (isInstruction(intstructions)) {
    return intstructions;
  }

  return null;
}

function isInstruction(arr: Dissect[]): arr is Instruction {
  return arr.length === 2;
}

function applyInstruction(
  instruction: Instruction,
  outsideState: Outside,
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
  subtract: Shapes,
): Shapes3d {
  const shapeComponents = mappings[shape3d];
  const updatedMapping = shapeComponents
    .filter(component => component !== subtract)
    .concat(add);

  return findNewShape(updatedMapping);
}

function findNewShape(shapes: Shapes[]): Shapes3d {
  const newShape = Object.entries(mappings).find(([key, value]) =>
    value.every(shape => shapes.includes(shape)),
  )?.[0] as Shapes3d;
  if (!newShape) {
    throw new Error(`No shape found for ${shapes.join(', ')}`);
  }
  return newShape;
}
