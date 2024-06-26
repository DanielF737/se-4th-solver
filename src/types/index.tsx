export enum Shapes {
  CIRCLE = 'C',
  SQUARE = 'S',
  TRIANGLE = 'T',
}

export enum Shapes3d {
  SPHERE = 'CC',
  CUBE = 'SS',
  TETRAHEDRON = 'TT',
  CYLINDER = 'CS',
  CONE = 'CT',
  TRILATERAL = 'TS',
}

export const doubleShapes = [
  Shapes3d.CUBE,
  Shapes3d.SPHERE,
  Shapes3d.TETRAHEDRON,
];

export const mappings: Record<Shapes3d, [Shapes, Shapes]> = {
  [Shapes3d.CUBE]: [Shapes.SQUARE, Shapes.SQUARE],
  [Shapes3d.SPHERE]: [Shapes.CIRCLE, Shapes.CIRCLE],
  [Shapes3d.TETRAHEDRON]: [Shapes.TRIANGLE, Shapes.TRIANGLE],
  [Shapes3d.CYLINDER]: [Shapes.CIRCLE, Shapes.SQUARE],
  [Shapes3d.CONE]: [Shapes.CIRCLE, Shapes.TRIANGLE],
  [Shapes3d.TRILATERAL]: [Shapes.TRIANGLE, Shapes.SQUARE],
};

export enum Side {
  LEFT = 'L',
  RIGHT = 'R',
  MID = 'M',
}

export const numberToSideMapping: Record<number, Side> = {
  0: Side.LEFT,
  1: Side.MID,
  2: Side.RIGHT,
};

export const sideToNumberMapping: Record<Side, number> = {
  [Side.LEFT]: 0,
  [Side.MID]: 1,
  [Side.RIGHT]: 2,
};

export type Dissect = { side: Side; shape: Shapes };

export type Swap = [Dissect, Dissect];
export type Instruction = { swap: Swap; expectedState: Outside };

export type Inside = [Shapes, Shapes, Shapes];
export type Outside = [Shapes3d, Shapes3d, Shapes3d];
