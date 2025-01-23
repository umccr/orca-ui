import { Dialog } from '@/components/common/dialogs';
import { useTheme } from '@/context/ThemeContext';
import { SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';
import { CheckIcon } from '@heroicons/react/20/solid';

type Props = { onClose: () => void };

const AppearanceDialog = ({ onClose }: Props) => {
  const { currentTheme, changeCurrentTheme } = useTheme();

  const themeOptions = [
    {
      value: 'light',
      icon: SunIcon,
      label: 'Light',
      description: 'Light theme for bright environments',
    },
    {
      value: 'dark',
      icon: MoonIcon,
      label: 'Dark',
      description: 'Dark theme for low-light environments',
    },
    {
      value: 'system',
      icon: ComputerDesktopIcon,
      label: 'System',
      description: 'Follows your system preferences',
    },
  ] as const;

  return (
    <Dialog onClose={onClose} title='Appearance' open>
      <div className='p-6'>
        <div className='mb-6'>
          <h3 className='text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100'>
            Theme preferences
          </h3>
          <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
            Choose how your application looks
          </p>
        </div>

        <div className='space-y-3'>
          {themeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => changeCurrentTheme(option.value)}
              className={`group relative flex w-full items-center gap-4 rounded-lg border p-4 transition-all duration-150 ${
                currentTheme === option.value
                  ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500 dark:border-blue-400 dark:bg-blue-950/30 dark:ring-blue-400'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:border-gray-600 dark:hover:bg-gray-800'
              }`}
            >
              <div
                className={`shrink-0 rounded-md p-2 transition-colors ${
                  currentTheme === option.value
                    ? 'bg-blue-500 text-white dark:bg-blue-400 dark:text-gray-900'
                    : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:group-hover:bg-gray-700'
                }`}
              >
                <option.icon className='h-5 w-5' />
              </div>

              <div className='flex-grow text-left'>
                <div
                  className={`font-medium ${
                    currentTheme === option.value
                      ? 'text-blue-700 dark:text-blue-300'
                      : 'text-gray-900 dark:text-gray-100'
                  }`}
                >
                  {option.label}
                </div>
                <div className='text-sm text-gray-500 dark:text-gray-400'>{option.description}</div>
              </div>

              {currentTheme === option.value && (
                <div className='shrink-0 text-blue-500 dark:text-blue-400'>
                  <CheckIcon className='h-5 w-5' />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </Dialog>
  );
};

export default AppearanceDialog;
