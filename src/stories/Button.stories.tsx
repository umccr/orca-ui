import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Button, IconButton } from '@/components/common/buttons';
import { ButtonProps } from '@/components/common/buttons/Button';
import { IconButtonProps } from '@/components/common/buttons/IconButton';
import { CheckCircleIcon, PlusIcon, ArrowDownOnSquareIcon } from '@heroicons/react/20/solid';
import { Spinner } from '@/components/common/spinner';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<ButtonProps> = {
  title: 'Common/Buttons',
  component: Button,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    type: {
      control: 'text',
      options: ['primary', 'secondary', 'light', 'green', 'red', 'yellow'],
      description: 'The type of button',
    },
  },
  // // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { onClick: fn() },
};

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    type: 'primary',
    size: 'md',
    children: 'Button',
  },
};

export const Gradient: Story = {
  args: {
    type: 'primary',
    size: 'md',
    children: 'Button',
    className: 'bg-gradient-to-r from-blue-500 via-blue-600',
  },
};

export const WithLeadingIcon: Story = {
  args: {
    type: 'primary',
    size: 'md',
    children: (
      <>
        <CheckCircleIcon className='-ml-0.5 h-5 w-5' aria-hidden='true' />
        Button
      </>
    ),
  },
};

export const WithLeadingSpinner: Story = {
  args: {
    type: 'primary',
    size: 'md',
    children: (
      <>
        <Spinner />
        Loading ...
      </>
    ),
  },
};

export const CircularButtons: Story = {
  args: {
    type: 'primary',
    size: 'md',
    children: <PlusIcon className='h-5 w-5' aria-hidden='true' />,
    rounded: true,
    className: '!p-2 !m-0',
  },
};

// Update the story type
export const IconButtonStory: StoryObj<IconButtonProps> = {
  render: () => (
    <IconButton
      onClick={() => console.log('testing')}
      icon={<ArrowDownOnSquareIcon className='h-5 w-5' />}
      tooltip='Export'
      tooltipPosition='top'
      tooltipBackground='light'
    />
  ),
};
