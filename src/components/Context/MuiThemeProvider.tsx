import {
  CssBaseline,
  ThemeProvider,
  createTheme,
  useMediaQuery,
} from '@mui/material';
import React from 'react';

// Types for the context and the provider
type Props = {
  children: React.ReactNode;
};

type TContext = {
  theme: boolean;
  toggleDarkMode: () => void;
};

// Creating the context for the theme and dark mode
export const ThemeContext = React.createContext<TContext>({
  theme: true,
  toggleDarkMode: () => {},
});

// Theme provider to be imported in root provider for code cleanliness
const MuiThemeProvider = ({ children }: Props) => {
  /*
    The following code block is used to set the theme to dark mode if the user 
    has set their system to dark mode. It also stores the user's preference in
    local storage so that the theme is set to dark mode on subsequent visits.
  */
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [resolvedTheme, setResolvedTheme] = React.useState<boolean>(() => {
    const storedValue = localStorage.getItem('darkMode');
    return storedValue !== null ? JSON.parse(storedValue) : prefersDarkMode;
  });
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: resolvedTheme ? 'dark' : 'light',
        },
      }),
    [resolvedTheme]
  );
// After creating the theme
document.documentElement.style.setProperty(
  '--background-color',
  resolvedTheme ? '#121212' : '#f5f5f5'
);


  const toggleDarkMode = () => {
    const newDarkModeValue = !resolvedTheme;
    setResolvedTheme(newDarkModeValue);
    localStorage.setItem('darkMode', JSON.stringify(newDarkModeValue));
  };

  // The context is used to pass the theme and dark mode toggle to the components
  const value = { theme: resolvedTheme, toggleDarkMode };
  return (
    <ThemeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export default MuiThemeProvider;
