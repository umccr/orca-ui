import { useTheme } from '@/context/ThemeContext';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

export default function ThemeToggle() {
  const { currentTheme, changeCurrentTheme } = useTheme();

  return (
    <button
      onClick={() => changeCurrentTheme(currentTheme === 'light' ? 'dark' : 'light')}
      className='bg-heritage-blue-200/20 hover:bg-heritage-blue-200/30 relative flex h-9 w-9 items-center justify-center rounded-lg text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/20 dark:bg-gray-700 dark:hover:bg-gray-600'
      aria-label={`Switch to ${currentTheme === 'light' ? 'dark' : 'light'} mode`}
    >
      <SunIcon className='absolute h-5 w-5 transition-opacity dark:opacity-0' />
      <MoonIcon className='absolute h-5 w-5 opacity-0 transition-opacity dark:opacity-100' />
    </button>
  );
}
