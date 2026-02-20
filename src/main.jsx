import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';
import 'leaflet/dist/leaflet.css';
import './styles.css';
import App from './App';

const theme = createTheme({
  fontFamily: 'Pretendard, sans-serif',
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <MantineProvider theme={theme}>
    <App />
  </MantineProvider>
);
