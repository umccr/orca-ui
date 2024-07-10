import type { Meta, StoryObj } from '@storybook/react';
import Button from '@/components/common/buttons/Button';
import toaster from '@/components/common/toaster/toaster';
import { ToastContainer } from 'react-toastify';

const meta: Meta = {
  title: 'Common/Toasts',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const ToastTester: Story = {
  render: () => {
    return (
      <div className='w-full h-full'>
        <Button
          onClick={() =>
            toaster.success({
              title: 'Success',
              message: 'This is a success toast',
            })
          }
        >
          Show Success Toast
        </Button>
        <Button
          onClick={() =>
            toaster.info({
              title: 'Info',
              message: 'This is an info toast',
            })
          }
        >
          Show Info Toast
        </Button>
        <Button
          onClick={() =>
            toaster.error({
              title: 'Error',
              message: 'This is an error toast',
            })
          }
        >
          Show Error Toast
        </Button>
        <Button
          onClick={() =>
            toaster.warning({
              title: 'Warning',
              message: 'This is a warning toast',
            })
          }
        >
          Show Warning Toast
        </Button>

        <ToastContainer />
      </div>
    );
  },
};
