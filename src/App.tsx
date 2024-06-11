import React from 'react';
import { CssBaseline, CssVarsProvider } from '@mui/joy';
import { Solver } from './components';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { ColorSchemeToggle } from './components/theme';

function App() {
  return (
    <CssVarsProvider defaultMode="dark">
      <CssBaseline />
      <ColorSchemeToggle />
      <div style={{ padding: 16 }}>
        <Router>
          <Routes>
            <Route path="/salv-4th-solver" element={<Solver />} />
            <Route path="/" element={<Navigate to="/salv-4th-solver" />} />
          </Routes>
        </Router>
      </div>
    </CssVarsProvider>
  );
}

export default App;
