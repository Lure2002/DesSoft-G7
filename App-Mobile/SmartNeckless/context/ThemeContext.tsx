import React, { createContext, useContext } from 'react';
import { useColorScheme } from 'react-native';

type Theme = 'light' | 'dark';

const ThemeContext = createContext<Theme>('light');

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme = useColorScheme() || 'light';
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
