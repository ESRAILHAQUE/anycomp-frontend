'use client';

import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  palette: {
    primary: {
      main: '#222222',
    },
    secondary: {
      main: '#1976d2',
    },
  },
  typography: {
    fontFamily: ['Red Hat Display', 'sans-serif'].join(','),
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </Provider>
  );
}

