import {
  Box,
  Button,
  Card,
  IconButton,
  Link,
  Modal,
  ModalClose,
  ModalDialog,
  Sheet,
  Switch,
  Table,
  Typography,
} from '@mui/joy';
import {
  Inside,
  Instruction,
  Outside,
  Shapes,
  Shapes3d,
  Side,
} from '../../types';
import { useMemo, useState } from 'react';
import { checkInvalid, solver } from '../../lib';
import {
  ContentCopy,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from '@mui/icons-material';
import { ShapeToImage } from '../../lib/shapeToImage';
import { FashionWidget } from '../Fashion Check';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export function Solver() {
  return (
    <Box
      width="100%"
      display="flex"
      justifyContent="flex-start"
      alignItems="center"
      flexDirection="column"
      gap="1rem"
      pb="5rem"
    >
      <Typography level="h1">
        {'Salvations Edge Verity (4th) Encounter Solver'}
      </Typography>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        gap="1rem"
      >
        <Box
          display="flex"
          gap="1rem"
          justifyContent="center"
          flexWrap={{ xs: 'wrap', md: 'nowrap' }}
        >
          <Box
            display="flex"
            flexDirection="column"
            gap="0.5rem"
            alignItems="center"
          >
            <DissectionWidget />
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            gap="0.5rem"
            alignItems="center"
          >
            <Typography level="h2">Team Fashion</Typography>
            <FashionWidget />
          </Box>
        </Box>
        <HowToCell />
        <a
          href="https://forms.gle/T9PG4Lo72Tgje6Rq5"
          target="_blank"
          rel="noreferrer"
        >
          <Link>Feedback? Bug reports? Feature requests? Click here!</Link>
        </a>
      </Box>
    </Box>
  );
}

type DissectionConfig = {
  abbreviatedCallouts: boolean;
};

function DissectionWidget() {
  const [isOpen, setIsOpen] = useState(false);
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

  const [config, setConfig] = useLocalStorage<DissectionConfig>(
    'dissection-config',
    {
      abbreviatedCallouts: false,
    }
  );

  const isValid = useMemo(() => {
    return checkInvalid(inside, outside);
  }, [inside, outside]);

  const result = useMemo(() => {
    return solver(inside, outside);
  }, [inside, outside]);
  return (
    <>
      <SettingsModal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        setConfig={setConfig}
        config={config}
      />
      <Typography level="h2">Dissection Calculator</Typography>
      <Card
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          alignItems: 'center',
          minWidth: '400px',
        }}
      >
        <Typography level="h2">Inside</Typography>
        <InsideInput inside={inside} setInside={setInside} />
        <Typography level="h2">Outside</Typography>
        <OutsideInput outside={outside} setOutside={setOutside} />
        <Typography level="h2">Instructions</Typography>
        <Instructions instructions={result} isValid={isValid} config={config} />
        <Button onClick={() => setIsOpen(true)}>Settings</Button>
      </Card>
    </>
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
  config,
}: {
  instructions: Instruction[];
  isValid: boolean;
  config: DissectionConfig;
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
          <InstructionCell
            key={index}
            instruction={instruction}
            config={config}
          />
        ))}
      </Box>
      <CopyForIngame instructions={instructions} config={config} />
    </>
  );
}

function InstructionCell({
  instruction,
  config: { abbreviatedCallouts },
}: {
  instruction: Instruction;
  config: DissectionConfig;
}) {
  return (
    <Box>{`${getLangForSide(instruction.swap[0].side, abbreviatedCallouts)}${getLangForShape(
      instruction.swap[0].shape,
      abbreviatedCallouts
    )} ↔ ${getLangForSide(instruction.swap[1].side, abbreviatedCallouts)}${getLangForShape(
      instruction.swap[1].shape,
      abbreviatedCallouts
    )} - ${instruction.expectedState}`}</Box>
  );
}

const getLangForSide = (side: Side, abbreviatedCallouts: boolean) => {
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

const getLangForShape = (shape: Shapes, abbreviatedCallouts: boolean) => {
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
    default: {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _exhaustiveCheck: never = shape;
      return '';
    }
  }
};

function CopyForIngame({
  instructions,
  config: { abbreviatedCallouts },
}: {
  instructions: Instruction[];
  config: DissectionConfig;
}) {
  const stringToCopy = instructions
    .reduce((acc, curr) => {
      return `${acc}${getLangForSide(
        curr.swap[0].side,
        abbreviatedCallouts
      )}${getLangForShape(
        curr.swap[0].shape,
        abbreviatedCallouts
      )} ${getLangForSide(
        curr.swap[1].side,
        abbreviatedCallouts
      )}${getLangForShape(curr.swap[1].shape, abbreviatedCallouts)}, `;
    }, '')
    .slice(0, -2);

  return (
    <Button
      onClick={() => {
        try {
          navigator.clipboard.writeText(stringToCopy);
          console.log(stringToCopy);
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

function SettingsModal({
  open,
  onClose,
  config,
  setConfig,
}: {
  open: boolean;
  onClose: () => void;
  config: DissectionConfig;
  setConfig: (config: DissectionConfig) => void;
}) {
  const defaults: DissectionConfig = {
    abbreviatedCallouts: false,
  };

  const lang: Record<keyof DissectionConfig, string> = {
    abbreviatedCallouts: 'Abbreviated Callouts',
  };

  const handleChange = (key: keyof DissectionConfig, value: boolean) => {
    setConfig({
      ...config,
      [key]: value,
    });
  };

  return (
    <Modal
      aria-labelledby="modal-title"
      aria-describedby="modal-desc"
      open={open}
      onClose={onClose}
      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      <ModalDialog maxWidth="sm" minWidth="sm">
        <ModalClose variant="plain" sx={{ m: 1 }} />
        <Typography
          component="h2"
          id="modal-title"
          level="h4"
          textColor="inherit"
          fontWeight="lg"
          mb={1}
        >
          Dissection Calcultor Settings
        </Typography>
        <Box>
          <Table>
            <thead>
              <tr>
                <th>Setting</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(defaults).map((key) => (
                <tr key={key}>
                  <th>{lang[key as keyof DissectionConfig]}</th>
                  <td>
                    <Switch
                      checked={config[key as keyof DissectionConfig]}
                      onChange={(e) =>
                        handleChange(
                          key as keyof DissectionConfig,
                          e.target.checked
                        )
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Box>
      </ModalDialog>
    </Modal>
  );
}
