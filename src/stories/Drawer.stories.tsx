import { InfoDrawer } from '@/components/common/drawers';
// import { Button } from "@/components/common/buttons";
// import { useState } from "react";
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Common/Drawers',
  component: InfoDrawer,
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
    // const [isOpen, setIsOpen] = useState<boolean>(false);

    // function open() {
    //     setIsOpen(true);
    // }

    // function close() {
    //     setIsOpen(false);
    // }

    // function confirm() {
    //     setIsOpen(false);
    //     console.log('confirm');
    // }
    return (
      <>
        {/* <Button onClick={open}>Open drawer</Button> */}
        <InfoDrawer
        // open={isOpen}
        // title='Text Drawer'
        // content='This is a simple alert drawer'
        // closeBtn={{ label: 'Close', onClick: close }}
        // confirmBtn={{ label: 'Confirm', onClick: confirm }}
        ></InfoDrawer>
      </>
    );
  },
};
