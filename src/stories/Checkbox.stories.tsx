import { Checkbox } from '@/components/common/checkbox';
import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Common/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const SimpleCheckbox: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [checked, setChecked] = useState<boolean>(false);

    const onChange = (checked: boolean) => {
      setChecked(checked);
      console.log('onChange click', checked);
    };

    return <Checkbox checked={checked} onChange={onChange} label='Checkbox' />;
  },
};
