/* eslint-disable react-refresh/only-export-components */
// https://github.com/ArnaudBarre/eslint-plugin-react-refresh/issues/25#issuecomment-1729071347

import { createContext, useContext, useState, useEffect, PropsWithChildren } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface ThemeContextType {
  currentTheme: string;
  changeCurrentTheme: (newTheme: string) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  currentTheme: 'system',
  changeCurrentTheme: () => {},
});

export const useTheme = () => {
  return useContext(ThemeContext);
};

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const [persistedTheme, setPersistedTheme] = useLocalStorage('theme', 'system');
  const [currentTheme, setCurrentTheme] = useState<string>(persistedTheme || 'system');

  const changeCurrentTheme = (newTheme: string) => {
    setCurrentTheme(newTheme);
    setPersistedTheme(newTheme);
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleThemeChange = () => {
      document.documentElement.classList.add('[&_*]:!transition-none');

      const isDark = currentTheme === 'dark' || (currentTheme === 'system' && mediaQuery.matches);

      if (isDark) {
        document.documentElement.classList.add('dark');
        document.documentElement.style.colorScheme = 'dark';
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.style.colorScheme = 'light';
      }

      const transitionTimeout = setTimeout(() => {
        document.documentElement.classList.remove('[&_*]:!transition-none');
      }, 1);

      return () => clearTimeout(transitionTimeout);
    };

    handleThemeChange();
    mediaQuery.addEventListener('change', handleThemeChange);

    return () => {
      mediaQuery.removeEventListener('change', handleThemeChange);
    };
  }, [currentTheme]);

  return (
    <ThemeContext.Provider value={{ currentTheme, changeCurrentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
