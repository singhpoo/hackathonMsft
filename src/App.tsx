import React from 'react';
import HomePage from './HomePage';
import { ThemeProvider, createTheme } from '@fluentui/react';

const App: React.FC = () => {
  const theme = createTheme();
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <HomePage />
      </div>
    </ThemeProvider>
  );
};

export default App;