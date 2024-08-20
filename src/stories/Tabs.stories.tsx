import type { Meta, StoryObj } from '@storybook/react';
import { ContentTabs, LinkTabs } from '@/components/navigation/tabs';

const meta: Meta = {
  title: 'Navigation/Tabs',
  component: ContentTabs,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const LinkTabsStory: Story = {
  render: () => {
    const tabs = [
      { name: 'My Account', href: '#', current: true },
      { name: 'Company', href: '#', current: false },
      { name: 'Team Members', href: '#', current: false },
      { name: 'Billing', href: '#', current: false },
    ];
    return <LinkTabs tabs={tabs} />;
  },
};

export const ContentTabsStory: Story = {
  render: () => (
    <ContentTabs
      tabs={[
        { label: 'Tab 1', content: <div>Tab 1 content</div> },
        { label: 'Tab 2', content: <div>Tab 2 content</div> },
        { label: 'Tab 3', content: <div>Tab 3 content</div> },
      ]}
    />
  ),
};
