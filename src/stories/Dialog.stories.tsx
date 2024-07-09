import Dialog from '@/components/dialogs/Dialog';
import type { Meta, StoryObj } from '@storybook/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export interface DialogProps {
  DialogIcon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  dialogTitle: string;
  dialogContent?: string;
  open: boolean;
  onClose: React.MouseEventHandler<HTMLButtonElement>;
  onConfirm?: React.MouseEventHandler<HTMLButtonElement>;
}

const meta: Meta = {
  title: 'Common/Alert',
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
  args: {
    DialogIcon: ExclamationTriangleIcon,
    dialogTitle: 'Text Dialog',
    dialogContent: 'This is a simple alert dialog',
    open: true,
    onClose: () => {
      console.log('onClose');
    },
    onConfirm: () => {
      console.log('onConfirm');
    },
  },
};
