import { Shapes, Shapes3d } from '../types';

import Square from '../assets/images/icons/square.svg';
import Circle from '../assets/images/icons/circle.svg';
import Triangle from '../assets/images/icons/triangle.svg';
import Sphere from '../assets/images/icons/sphere.svg';
import Cube from '../assets/images/icons/cube.svg';
import Tetrahedron from '../assets/images/icons/tetrahedron.svg';
import Cylinder from '../assets/images/icons/cylinder.svg';
import Cone from '../assets/images/icons/cone.svg';
import TriangularPrism from '../assets/images/icons/triangularPrism.svg';
import { useColorScheme } from '@mui/joy';

export function ShapeToImage({
  shape,
  selected = false,
}: {
  shape: Shapes | Shapes3d;
  selected?: boolean;
}) {
  const { mode } = useColorScheme();
  let svgSrc;

  switch (shape) {
    case Shapes.SQUARE: {
      svgSrc = Square;

      break;
    }
    case Shapes.CIRCLE: {
      svgSrc = Circle;
      break;
    }
    case Shapes.TRIANGLE: {
      svgSrc = Triangle;
      break;
    }
    case Shapes3d.SPHERE: {
      svgSrc = Sphere;
      break;
    }
    case Shapes3d.CUBE: {
      svgSrc = Cube;
      break;
    }
    case Shapes3d.TETRAHEDRON: {
      svgSrc = Tetrahedron;
      break;
    }
    case Shapes3d.CYLINDER: {
      svgSrc = Cylinder;
      break;
    }
    case Shapes3d.CONE: {
      svgSrc = Cone;
      break;
    }
    case Shapes3d.TRILATERAL: {
      svgSrc = TriangularPrism;
      break;
    }
    default:
      return null;
  }

  return (
    <img
      src={svgSrc}
      alt={shape}
      width="25"
      style={{
        filter: mode === 'dark' || selected ? 'invert(1)' : 'invert(0)',
      }}
    />
  );
}
