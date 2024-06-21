import { Box, Button, IconButton, Sheet, Typography } from '@mui/joy';
import { Inside, Instruction, Outside, Shapes, Shapes3d } from '../../types';
import { useMemo, useState } from 'react';
import { checkInvalid, solver } from '../../lib';
import {
  ContentCopy,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from '@mui/icons-material';
import { ShapeToImage } from '../../lib/shapeToImage';
import { FashionWidget } from '../Fashion Check';

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
    return solver(inside, outside);
  }, [inside, outside]);

  return (
    <Box
      width="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      gap="0.25rem"
      pb="5rem"
    >
      <Typography level="h1">
        {'Salvations Edge Verity (4th) Encounter Solver'}
      </Typography>
      <HowToCell />
      <Typography level="h2">Inside</Typography>
      <InsideInput inside={inside} setInside={setInside} />
      <Typography level="h2">Outside</Typography>
      <OutsideInput outside={outside} setOutside={setOutside} />
      <Typography level="h2">Instructions</Typography>
      <Instructions instructions={result} isValid={isValid} />
      <Typography level="h2" sx={{ mt: '1rem' }}>
        Team Fashion
      </Typography>
      <FashionWidget />
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
      const oldShape = arr[index];
      const existingIndex = arr.indexOf(shape);
      arr[index] = shape;
      if (existingIndex !== -1) {
        arr[existingIndex] = oldShape;
      }
      setInside(arr);
    };
  }

  return (
    <Box>
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
          <Box
            display="flex"
            gap="0.25rem"
            alignItems="center"
            flexDirection="column"
            justifyContent="center"
          >
            <ShapeToImage shape={s} selected={s === shape} />
            {s}
          </Box>
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
          <Box
            display="flex"
            gap="0.25rem"
            alignItems="center"
            flexDirection="column"
            justifyContent="center"
          >
            <ShapeToImage shape={s} selected={s === shape} />
            {s}
          </Box>
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
    <>
      <Box display="flex" flexDirection="column" gap="0.25rem">
        {instructions.map((instruction, index) => (
          <InstructionCell key={index} instruction={instruction} />
        ))}
      </Box>
      <CopyForIngame instructions={instructions} />
    </>
  );
}

function InstructionCell({ instruction }: { instruction: Instruction }) {
  return (
    <Box>{`${instruction.swap[0].side}${instruction.swap[0].shape} ↔ ${instruction.swap[1].side}${instruction.swap[1].shape} - ${instruction.expectedState}`}</Box>
  );
}

function CopyForIngame({ instructions }: { instructions: Instruction[] }) {
  const stringToCopy = instructions
    .reduce((acc, curr) => {
      return `${acc}${curr.swap[0].side}${curr.swap[0].shape} ${curr.swap[1].side}${curr.swap[1].shape}, `;
    }, '')
    .slice(0, -2);

  return (
    <Button
      onClick={() => {
        try {
          navigator.clipboard.writeText(stringToCopy);
        } catch (err) {
          console.error(`Failed to copy text: ${stringToCopy}`, err);
        }
      }}
      endDecorator={<ContentCopy />}
    >
      {'Copy for ingame chat'}
    </Button>
  );
}

function HowToCell() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet
      variant="soft"
      color="primary"
      sx={{
        p: '1rem',
        borderRadius: '0.25rem',
        width: '80vw',
        maxWidth: '40rem',
      }}
    >
      <Box
        width="100%"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Typography level="h4">How to use this tool</Typography>
        <IconButton onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
        </IconButton>
      </Box>
      {isOpen ? (
        <>
          <Typography level="body-sm">
            {
              'This tool is used to solve the Salvations Edge 4th Encounter. Input the 3 symbols on the statues that the inside (alone) players see, and the 3 3d shapes that the outside (together) players see, and the tool will output the correct dissections the outside team needs to make to solve the puzzle from their perspective'
            }
          </Typography>
          <br />
          <Sheet
            variant="outlined"
            color="primary"
            sx={{
              p: '0.5rem',
              borderRadius: '0.25rem',
            }}
          >
            <Typography level="title-sm">Symbol Key</Typography>
            <Typography level="body-xs">
              C = Circle, S = Square, T = Triangle
            </Typography>
            <Typography level="body-xs">
              L = Left, M = Middle, R = Right
            </Typography>
            <br />
            <Typography level="body-xs">
              3d shapes are represented by the two 2d shapes that are used to
              create them, e.g CT = Circle Triangle = Cone
            </Typography>
            <br />
            <Typography level="body-xs">
              Dissect instructions are represented by a pair of side letter and
              shape letter pairs, e.g LT ↔ MS = Left Triangle, Middle Square.
              The characters after represent the expected state after the
              disection, e.g CS TT CS = Cylinder, Tetrahedron, Cylinder
            </Typography>
          </Sheet>
        </>
      ) : null}
    </Sheet>
  );
}
