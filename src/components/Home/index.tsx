import { Card, Typography, Box } from '@mui/joy';
import { Link } from 'react-router-dom';

export function Home() {
  return (
    <Box
      width="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      gap="0.25rem"
    >
      <Typography level="h1">
        {'Salvations Edge Verity (4th) Encounter Solver'}
      </Typography>
      <Card>
        <Box display="flex" flexDirection="column" gap="0.5rem">
          <Link to={'/salv-4th-solver'}>
            <Typography>Verity Solver</Typography>
          </Link>
          <Link to={'/fashion-check'}>
            <Typography>Fashion Check</Typography>
          </Link>
        </Box>
      </Card>
    </Box>
  );
}
