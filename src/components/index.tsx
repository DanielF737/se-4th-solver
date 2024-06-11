import { Box, Button, Typography } from '@mui/joy';
import { Inside, Instruction, Outside, Shapes, Shapes3d } from '../types';
import { useMemo, useState } from 'react';
import { checkInvalid, solver } from '../lib';

export function Solver() {
  const [inside, setInside] = useState<Inside>([
    Shapes.CIRCLE,
    Shapes.TRIANGLE,
    Shapes.SQUARE,
  ]);
  const [outside, setOutside] = useState<Outside>([
    Shapes3d.CYLINDER,
    Shapes3d.TETRAHEDRON,
    Shapes3d.CYLINDER,
  ]);

  const isValid = useMemo(() => {
    return checkInvalid(inside, outside);
  }, [inside, outside]);

  const result = useMemo(() => {
    return solver(inside, outside, isValid);
  }, [inside, outside, isValid]);

  return (
    <Box
      width="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Box>
        {/* Input Inside */}
        <InsideInput inside={inside} setInside={setInside} />
        {/* Input Outside */}
        <OutsideInput outside={outside} setOutside={setOutside} />
        {/* Input Show Result */}
        <Instructions instructions={result} isValid={isValid} />
      </Box>
    </Box>
  );
}

function InsideInput({
  inside,
  setInside,
}: {
  inside: Inside;
  setInside: (shapes: Inside) => void;
}) {
  function setShape(index: number) {
    return (shape: Shapes) => {
      const arr: Inside = [...inside];
      arr[index] = shape;
      setInside(arr);
    };
  }

  return (
    <Box>
      <Typography>Inside</Typography>
      <Box display="flex" gap="0.5rem">
        {inside.map((shape, index) => (
          <InsideCell key={index} shape={shape} setShape={setShape(index)} />
        ))}
      </Box>
    </Box>
  );
}

function InsideCell({
  shape,
  setShape,
}: {
  shape: Shapes;
  setShape: (shape: Shapes) => void;
}) {
  return (
    <Box display="flex" gap="0.25rem" flexDirection="column">
      {Object.values(Shapes).map((s) => (
        <Button
          key={s}
          variant={s === shape ? 'solid' : 'outlined'}
          onClick={() => setShape(s)}
        >
          {s}
        </Button>
      ))}
    </Box>
  );
}

function OutsideInput({
  outside,
  setOutside,
}: {
  outside: Outside;
  setOutside: (shapes: Outside) => void;
}) {
  function setShape(index: number) {
    return (shape: Shapes3d) => {
      const arr: Outside = [...outside];
      arr[index] = shape;
      setOutside(arr);
    };
  }

  return (
    <Box>
      <Typography>Outside</Typography>
      <Box display="flex" gap="0.5rem">
        {outside.map((shape, index) => (
          <OutsideCell key={index} shape={shape} setShape={setShape(index)} />
        ))}
      </Box>
    </Box>
  );
}

function OutsideCell({
  shape,
  setShape,
}: {
  shape: Shapes3d;
  setShape: (shape: Shapes3d) => void;
}) {
  return (
    <Box display="flex" gap="0.25rem" flexDirection="column">
      {Object.values(Shapes3d).map((s) => (
        <Button
          key={s}
          variant={s === shape ? 'solid' : 'outlined'}
          onClick={() => setShape(s)}
        >
          {s}
        </Button>
      ))}
    </Box>
  );
}

function Instructions({
  instructions,
  isValid,
}: {
  instructions: Instruction[];
  isValid: boolean;
}) {
  if (!isValid) {
    return <Typography>Invalid state</Typography>;
  }

  if (instructions.length === 0) {
    return <Typography>Already solved</Typography>;
  }

  return (
    <Box display="flex" flexDirection="column" gap="0.25rem">
      <Typography>Instructions</Typography>
      {instructions.map((instruction, index) => (
        <InstructionCell key={index} instruction={instruction} />
      ))}
    </Box>
  );
}

function InstructionCell({ instruction }: { instruction: Instruction }) {
  return (
    <Box>{`${instruction[0][0]}${instruction[0][1]} ↔ ${instruction[1][0]}${instruction[1][1]}`}</Box>
  );
}
