import { Shapes, Shapes3d, Side } from '../../types';

export const getLangForSide = (side: Side, abbreviatedCallouts: boolean) => {
  if (abbreviatedCallouts) {
    return side;
  }

  switch (side) {
    case Side.LEFT:
      return 'Left ';
    case Side.MID:
      return 'Middle ';
    case Side.RIGHT:
      return 'Right ';
    default: {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _exhaustiveCheck: never = side;
      return '';
    }
  }
};

export const getLangForShape = (
  shape: Shapes | Shapes3d,
  abbreviatedCallouts: boolean
) => {
  if (abbreviatedCallouts) {
    return shape;
  }

  switch (shape) {
    case Shapes.CIRCLE:
      return 'Circle';
    case Shapes.SQUARE:
      return 'Square';
    case Shapes.TRIANGLE:
      return 'Triangle';
    case Shapes3d.CUBE:
      return 'Cube';
    case Shapes3d.SPHERE:
      return 'Sphere';
    case Shapes3d.TETRAHEDRON:
      return 'Tetrahedron';
    case Shapes3d.CYLINDER:
      return 'Cylinder';
    case Shapes3d.CONE:
      return 'Cone';
    case Shapes3d.TRILATERAL:
      return 'Triangular Prism';
    default: {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _exhaustiveCheck: never = shape;
      return '';
    }
  }
};
