import { useState } from 'react';
import { Dialog } from '@/components/common/dialogs';
import { Button } from '@/components/common/buttons';
import type { Meta, StoryObj } from '@storybook/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const meta: Meta = {
  title: 'Common/Dialogs',
  component: Dialog,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const SimpleDialog: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [isOpen, setIsOpen] = useState<boolean>(false);

    function open() {
      setIsOpen(true);
    }

    function close() {
      setIsOpen(false);
    }

    function confirm() {
      setIsOpen(false);
      console.log('confirm');
    }
    return (
      <>
        <Button onClick={open}>Open dialog</Button>
        <Dialog
          TitleIcon={ExclamationTriangleIcon}
          open={isOpen}
          title='Text Dialog'
          content='This is a simple alert dialog'
          onClose={close}
          closeBtn={{ label: 'Close', onClick: close }}
          confirmBtn={{ label: 'Confirm', onClick: confirm }}
        ></Dialog>
      </>
    );
  },
};
