import { Drawer } from '@/components/common/drawers';
import { Button } from '@/components/common/buttons';
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Common/Drawers',
  component: Drawer,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const SimpleDrawer: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [isOpen, setIsOpen] = useState<boolean>(false);

    function open() {
      setIsOpen(true);
    }

    return (
      <>
        <Button onClick={open}>Open drawer</Button>
        <Drawer
          isOpen={isOpen}
          title='Text Drawer'
          setIsOpen={setIsOpen}
          content='This is a simple alert drawer'
        ></Drawer>
      </>
    );
  },
};
