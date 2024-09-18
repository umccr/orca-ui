import { useState, useEffect, FC } from 'react';
import { Description, Field, Label, Switch } from '@headlessui/react';

interface ToggleProps {
  label: string;
  description?: string;
  onChange: (enabled: boolean) => void;
  checked: boolean;
}
const Toggle: FC<ToggleProps> = ({ label, description, onChange, checked }) => {
  const [isChecked, setIsChecked] = useState(checked || false);

  useEffect(() => {
    setIsChecked(checked || false);
  }, [checked]);

  return (
    <Field className='flex items-center justify-between'>
      <span className='flex flex-grow flex-col text-nowrap pr-2'>
        {label && (
          <Label as='span' passive className='text-sm font-medium leading-6 text-gray-900'>
            {label}
          </Label>
        )}
        {description && (
          <Description as='span' className='text-sm text-gray-500'>
            Nulla amet tempus sit accumsan. Aliquet turpis sed sit lacinia.
          </Description>
        )}
      </span>
      <Switch
        checked={isChecked}
        onChange={onChange}
        className='group  inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-1 data-[checked]:bg-indigo-600'
      >
        <span
          aria-hidden='true'
          className='pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out group-data-[checked]:translate-x-5'
        />
      </Switch>
    </Field>
  );
};

export default Toggle;