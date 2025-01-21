import { useTheme } from '@/context/ThemeContext';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

export default function ThemeToggle() {
  const { currentTheme, changeCurrentTheme } = useTheme();

  return (
    <div className='flex items-center gap-2'>
      <span className='text-sm text-gray-600 dark:text-gray-300'>Light</span>

      <button
        onClick={() => changeCurrentTheme(currentTheme === 'light' ? 'dark' : 'light')}
        className='relative inline-flex h-7 w-14 items-center rounded-full bg-gray-200 transition-colors dark:bg-gray-700'
        aria-label={`Switch to ${currentTheme === 'light' ? 'dark' : 'light'} mode`}
      >
        <span className='sr-only'>{currentTheme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
        <SunIcon className='absolute left-1 h-5 w-5 text-yellow-500 dark:text-gray-400' />
        <MoonIcon className='absolute right-1 h-5 w-5 text-gray-400 dark:text-blue-100' />
        <div
          className={`${
            currentTheme === 'light' ? 'translate-x-1' : 'translate-x-8'
          } inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-200 ease-in-out`}
        />
      </button>

      <span className='text-sm text-gray-600 dark:text-gray-300'>Dark</span>
    </div>
  );
}
