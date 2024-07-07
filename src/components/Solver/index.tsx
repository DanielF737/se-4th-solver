import { Box, Link, Typography } from '@mui/joy';
import { VerityAdUnit } from '../Ads';
import { DissectionWidget } from './Dissection';
import { FashionWidget } from './Fashion Check';
import { HowToCell, HowToFashionCell } from './HowToCells';

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
        <VerityAdUnit />
        <Box display="flex" gap="1rem" justifyContent="center" flexWrap="wrap">
          <Box>
            <HowToCell />
          </Box>
          <Box>
            <HowToFashionCell />
          </Box>
        </Box>
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
