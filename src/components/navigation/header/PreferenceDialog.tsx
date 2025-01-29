import { Dialog } from '@/components/common/dialogs';
import { useTheme } from '@/context/ThemeContext';
import { SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';
import { CheckIcon } from '@heroicons/react/20/solid';
import { Cog6ToothIcon, PaintBrushIcon } from '@heroicons/react/24/outline';
import { Accordion } from '@/components/common/accordion';

type Props = { onClose: () => void };

const PreferenceDialog = ({ onClose }: Props) => {
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
    <Dialog onClose={onClose} title='Preferences' TitleIcon={Cog6ToothIcon} open>
      <div className='divide-y divide-gray-200 dark:divide-gray-700'>
        <Accordion
          title={
            <div className='flex items-center gap-2'>
              <PaintBrushIcon className='h-5 w-5 text-gray-500 dark:text-gray-400' />
              <div className='flex flex-col'>
                <h3 className='text-sm font-medium text-gray-900 dark:text-gray-100'>
                  Theme preferences
                </h3>
                <p className='text-xs font-normal text-gray-500 dark:text-gray-400'>
                  Choose how your application looks
                </p>
              </div>
            </div>
          }
          defaultOpen={true}
          chevronPosition='right'
        >
          <div className='mt-2 space-y-3 rounded-lg'>
            {themeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => changeCurrentTheme(option.value)}
                className={`group relative flex w-full items-center gap-4 rounded-lg border border-gray-200 p-4 transition-all duration-150 dark:border-gray-700 ${
                  currentTheme === option.value
                    ? 'bg-blue-50 dark:bg-blue-950/30'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800'
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
                  <div className='text-sm text-gray-500 dark:text-gray-400'>
                    {option.description}
                  </div>
                </div>

                {currentTheme === option.value && (
                  <div className='shrink-0 text-blue-500 dark:text-blue-400'>
                    <CheckIcon className='h-5 w-5' />
                  </div>
                )}
              </button>
            ))}
          </div>
        </Accordion>

        {/* You can add more accordion sections here */}
      </div>
    </Dialog>
  );
};

export default PreferenceDialog;
