import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { Box, IconButton, Sheet, Typography } from '@mui/joy';
import { useState } from 'react';
import Fashion1 from '../../assets/images/howTo/selectedGuardian.png';
import Fashion2 from '../../assets/images/howTo/guardian.png';
import Fashion3 from '../../assets/images/howTo/refresh.png';
import Fashion4 from '../../assets/images/howTo/settings.png';
import Dissect1 from '../../assets/images/howTo/dissect.png';
import Dissect2 from '../../assets/images/howTo/instructions.png';
import Dissect3 from '../../assets/images/howTo/dissectSettings.png';
import { ShapeToImage } from '../../lib/shapeToImage';
import { Shapes, Shapes3d } from '../../types';
import { getLangForShape } from './helper';

export function HowToCell() {
  const [isOpen, setIsOpen] = useState(true);

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
        <Typography level="h4">
          How to use the dissection calculator tool
        </Typography>
        <IconButton onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
        </IconButton>
      </Box>
      {isOpen ? (
        <Box display="flex" flexDirection="column" gap="0.5rem">
          <Typography level="body-sm">
            {`This tool is used to solve the Salvations Edge 4th Encounter. Input the 3 symbols on the statues that the inside (alone) players see, and the 3 3d shapes that the outside (together) players see, and the tool will output the correct dissections the outside team needs to make to solve the puzzle from their perspective`}
          </Typography>
          <img src={Dissect1} alt="Dissect1" style={{ alignSelf: 'center' }} />
          <Typography level="body-sm">
            Dissect instructions are represented by a pair of side letter and
            shape letter pairs, e.g LT ↔ MS = Left Triangle, Middle Square. The
            characters after represent the expected state after the disection,
            e.g CS TT CS = Cylinder, Tetrahedron, Cylinder
          </Typography>
          <img src={Dissect2} alt="Dissect2" style={{ alignSelf: 'center' }} />
          <Typography level="body-sm">
            {`Once the instructions are generated, you can utilize the "click to
            copy" to copy them to the clipboard so they can be quickly pasted in
            fireteam chat in game, so all your teammates are aligned on the
            course of action.`}
          </Typography>
          <Sheet
            variant="outlined"
            color="primary"
            sx={{
              p: '0.5rem',
              borderRadius: '0.25rem',
            }}
          >
            <Box
              display="flex"
              flexDirection="column"
              gap="0.5rem"
              width="100%"
            >
              <Typography level="title-md">Symbol Key</Typography>
              <Typography level="title-sm">2d Shapes:</Typography>
              <Box
                display="flex"
                flexWrap="wrap"
                gap="0.5rem"
                alignSelf="center"
              >
                {Object.values(Shapes).map((shape) => (
                  <ShapeChip key={shape} shape={shape} />
                ))}
              </Box>
              <Typography level="title-sm">3d Shapes:</Typography>
              <Box
                display="flex"
                flexWrap="wrap"
                gap="0.5rem"
                alignSelf="center"
                justifyContent="center"
              >
                {Object.values(Shapes3d).map((shape) => (
                  <Shape3dChip key={shape} shape={shape} />
                ))}
              </Box>
              <Typography level="title-sm">Sides:</Typography>
              <Typography level="body-xs">
                L = Left, M = Middle, R = Right
              </Typography>
            </Box>
          </Sheet>
          <Sheet
            variant="outlined"
            color="primary"
            sx={{
              p: '0.5rem',
              borderRadius: '0.25rem',
            }}
          >
            <Box
              display="flex"
              flexDirection="column"
              gap="0.5rem"
              width="100%"
            >
              <Typography level="title-sm">Settings explained</Typography>
              <img
                src={Dissect3}
                alt="Dissect3"
                style={{ alignSelf: 'center' }}
              />
              <Typography level="body-xs">{`The abbreviated callouts setting allows you to toggle the display of the full callouts, or just the abbreviated ones. This also applies to the click to copy functionality. So with the toggle on, a dissection of square on left and triangle on right would be represented as "LS RT", and with the toggle off it would be "Left Square Right Triangle".`}</Typography>
            </Box>
          </Sheet>
        </Box>
      ) : null}
    </Sheet>
  );
}

function ShapeChip({ shape }: { shape: Shapes }) {
  return (
    <Sheet
      variant="outlined"
      sx={{
        borderRadius: '0.25rem',
        p: '0.25rem',
      }}
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap="0.25rem"
        width="5rem"
      >
        <ShapeToImage shape={shape} />
        <Typography level="body-xs">{`${shape} = ${getLangForShape(shape, false)}`}</Typography>
      </Box>
    </Sheet>
  );
}

function Shape3dChip({ shape }: { shape: Shapes3d }) {
  return (
    <Sheet
      variant="outlined"
      sx={{
        borderRadius: '0.25rem',
        p: '0.25rem',
      }}
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap="0.25rem"
        width="10rem"
      >
        <ShapeToImage shape={shape} />
        <Typography level="body-xs">{`${shape} = ${getLangForShape(shape, false)}`}</Typography>
        <Typography level="body-xs">{`${getLangForShape(shape.split('')[0] as Shapes, false)} + ${getLangForShape(shape.split('')[1] as Shapes, false)}`}</Typography>
      </Box>
    </Sheet>
  );
}

export function HowToFashionCell() {
  const [isOpen, setIsOpen] = useState(true);

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
        <Typography level="h4">How to use the fireteam fashion tool</Typography>
        <IconButton onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
        </IconButton>
      </Box>
      {isOpen ? (
        <Box display="flex" flexDirection="column" gap="0.5rem">
          <Typography level="body-sm">
            {`This tool is used to help identify your fireteam members' transmog
            and ghost shell, in order to help you make accurate callouts during
            the ghosts phase of the verity encounter`}
          </Typography>
          <img src={Fashion1} alt="fashion1" style={{ alignSelf: 'center' }} />
          <Typography level="body-sm">
            {`Start by inputting your Bungie Id into the Bungie Id field, and the app will automatically load up your D2 profile. You should see your display name, current emblem, and current (or most recently selected) class.`}
          </Typography>
          <img src={Fashion2} alt="fashion2" style={{ alignSelf: 'center' }} />
          <Typography level="body-sm">
            {`If you are currently in a fireteam, the app will also automatically load your current fireteam, showing their equipped armor (as per your current settings) and ghost shell. If using ornaments, there will be reflected as well.`}
          </Typography>
          <img src={Fashion3} alt="fashion3" style={{ alignSelf: 'center' }} />
          <Typography level="body-sm">
            {`If the data is out of date (such as your fireteam has changed or the loadout of one of your fireteam members has changed), please hit the refresh button to fetch the latest data. Please note, there is a rate limit from bungie that only allows me to fetch new data every couple of minutes. There is nothing I can do to speed this up. If refreshing isnt pulling new data, wait a few minutes and try again.`}
          </Typography>
          <Sheet
            variant="outlined"
            color="primary"
            sx={{
              p: '0.5rem',
              borderRadius: '0.25rem',
            }}
          >
            <Box display="flex" flexDirection="column" gap="0.5rem">
              <Typography level="title-sm">Settings explained</Typography>

              <img
                src={Fashion4}
                alt="fashion4"
                style={{ alignSelf: 'center' }}
              />
              <Typography level="body-xs">
                {`The settings menu allows you to toggle what pieces of gear are shown, and can be toggled on a per class basis (to account for those hunters and their stupid cloaks 😅). Simply turn on the toggle relating to the piece of armour you wish to see, and any guardians of the given class will be shown.`}
              </Typography>

              <Typography level="body-xs">
                {`The exotic toggle will show the players currently equipped exotic no matter what slot it is in (ie irrespective of the state of your other toggles) to help identify players by a particularly visually distinct exotic/exotic ornament. For example, if you have a guardian with exotic leg armour equipped, and the exotic toggle set to on, and the leg toggle set to off, the leg exotic will still show.`}
              </Typography>
            </Box>
          </Sheet>
        </Box>
      ) : null}
    </Sheet>
  );
}
