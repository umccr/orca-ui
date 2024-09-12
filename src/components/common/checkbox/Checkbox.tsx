import { Checkbox as CheckboxComponent, Field, Label } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/16/solid';
import { useState } from 'react';

const Checkbox = () => {
  const [enabled, setEnabled] = useState(false);

  return (
    <Field className='flex items-center gap-2'>
      <CheckboxComponent
        checked={enabled}
        onChange={setEnabled}
        className='group block size-4 rounded border bg-white data-[checked]:bg-blue-500'
      >
        <CheckIcon className='hidden size-4 fill-black group-data-[checked]:block' />
      </CheckboxComponent>
      <Label>Enable beta features</Label>
    </Field>
  );
};

export default Checkbox;
