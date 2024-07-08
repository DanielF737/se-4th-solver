import {
  Box,
  Button,
  Card,
  Modal,
  ModalClose,
  ModalDialog,
  Switch,
  Table,
  Typography,
} from '@mui/joy';
import { Inside, Instruction, Outside, Shapes, Shapes3d } from '../../../types';
import { useMemo, useState } from 'react';
import { checkInvalid, solver } from '../../../lib';
import { ShapeToImage } from '../../../lib/shapeToImage';
import { useLocalStorage } from '../../../hooks/useLocalStorage';
import { getLangForShape, getLangForSide } from '../helper';
import { ContentCopy } from '@mui/icons-material';

type DissectionConfig = {
  abbreviatedCallouts: boolean;
};

export function DissectionWidget() {
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
          minWidth: '300px',
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
