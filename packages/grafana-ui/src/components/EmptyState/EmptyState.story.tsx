import { Meta, StoryFn } from '@storybook/react';
import React from 'react';

import { Button } from '../Button';

import { EmptyState } from './EmptyState';
import mdx from './EmptyState.mdx';

const meta: Meta<typeof EmptyState> = {
  title: 'General/EmptyState',
  component: EmptyState,
  parameters: {
    docs: {
      page: mdx,
    },
    controls: {
      exclude: ['image'],
    },
  },
  argTypes: {
    button: {
      control: 'select',
      options: ['None', 'Create', 'Clear filters'],
    },
    children: {
      type: 'string',
    },
  },
};

export const Basic: StoryFn<typeof EmptyState> = (args) => {
  let button;
  if (args.button === 'Create') {
    button = (
      <Button icon="plus" size="lg">
        Create dashboard
      </Button>
    );
  } else if (args.button === 'Clear filters') {
    button = <Button variant="secondary">Clear filters</Button>;
  }
  return <EmptyState {...args} button={button} />;
};

Basic.args = {
  button: 'Create',
  children: 'Use this space to add any additional information',
  message: "You haven't created any dashboards yet",
  variant: 'call-to-action',
};

export const MaxWidth: StoryFn<typeof EmptyState> = (args) => {
  const props = {
    button: (
      <Button icon="plus" size="lg">
        Create dashboard
      </Button>
    ),
    message: "You haven't created any dashboards yet",
    variant: 'call-to-action' as const,
    children:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  };
  return <EmptyState {...props} />;
};

MaxWidth.args = {
  button: 'Create',
  children: 'Use this space to add any additional information',
  message: "You haven't created any dashboards yet",
  variant: 'call-to-action',
};

export default meta;
