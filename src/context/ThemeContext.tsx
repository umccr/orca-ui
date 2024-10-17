import { createContext, useContext, useState, useEffect, PropsWithChildren } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface ThemeContextType {
  currentTheme: string;
  changeCurrentTheme: (newTheme: string) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  currentTheme: 'light',
  changeCurrentTheme: () => {},
});

export const useTheme = () => {
  return useContext(ThemeContext);
};

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const [persistedTheme, setPersistedTheme] = useLocalStorage('theme', 'light');
  const [currentTheme, setCurrentTheme] = useState<string>(persistedTheme || 'light');

  const changeCurrentTheme = (newTheme: string) => {
    setCurrentTheme(newTheme);
    setPersistedTheme(newTheme);
  };

  useEffect(() => {
    document.body.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  return (
    <ThemeContext.Provider value={{ currentTheme, changeCurrentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
