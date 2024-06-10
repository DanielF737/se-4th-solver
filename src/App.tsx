import React from 'react';
import ReactDOM from 'react-dom';
import {
  CssBaseline,
  ThemeProvider,
  extendTheme,
  Button,
  CssVarsProvider,
  useColorScheme,
  IconButton,
} from '@mui/joy';
import { useMemo } from 'react';
import { Solver } from './components';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';

function App() {
  const theme = useMemo(
    () =>
      extendTheme({
        colorSchemes: {
          dark: {
            palette: {
              mode: 'dark',
            },
          },
        },
      }),
    []
  );

  return (
    <CssVarsProvider defaultMode="dark">
      <CssBaseline />
      <ColorSchemeToggle />
      <div style={{ padding: 16 }}>
        <Solver />
      </div>
    </CssVarsProvider>
  );
}

function ColorSchemeToggle() {
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return null;
  }
  return (
    <IconButton
      id="toggle-mode"
      size="lg"
      variant="soft"
      color="neutral"
      onClick={() => {
        if (mode === 'light') {
          setMode('dark');
        } else {
          setMode('light');
        }
      }}
      sx={{
        position: 'fixed',
        zIndex: 999,
        top: '1rem',
        right: '1rem',
        borderRadius: '50%',
        boxShadow: 'sm',
      }}
    >
      {mode === 'light' ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
    </IconButton>
  );
}

export default App;
