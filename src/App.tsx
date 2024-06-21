import React from 'react';
import { CssBaseline, CssVarsProvider } from '@mui/joy';
import { Solver } from './components/Solver';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { ColorSchemeToggle } from './components/theme';
import { FashionCheck } from './components/Fashion Check';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6';
import { parse, stringify } from 'query-string';

function App() {
  return (
    <Router>
      <QueryParamProvider
        adapter={ReactRouter6Adapter}
        options={{
          searchStringToObject: parse,
          objectToSearchString: stringify,
        }}
      >
        <QueryClientProvider client={queryClient}>
          <CssVarsProvider defaultMode="dark">
            <CssBaseline />
            <ColorSchemeToggle />
            <div style={{ padding: 16 }}>
              <Routes>
                <Route path="/salv-4th-solver" element={<Solver />} />
                <Route path="/fashion-check" element={<FashionCheck />} />
                <Route path="/" element={<Navigate to="/salv-4th-solver" />} />
              </Routes>
            </div>
          </CssVarsProvider>
        </QueryClientProvider>
      </QueryParamProvider>
    </Router>
  );
}

export default App;
