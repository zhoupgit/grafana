import { action } from '@storybook/addon-actions';
import { Meta, Story } from '@storybook/react';
import React, { useState } from 'react';

import { SelectableValue } from '@grafana/data';

import mdx from './Select.mdx';
import { VariableMultiSelect } from './VariableMultiSelect';
import { generateOptions } from './mockOptions';

const meta: Meta = {
  title: 'Forms/VariableMultiSelect',
  component: VariableMultiSelect,
  parameters: {
    docs: {
      page: mdx,
    },
    controls: {
      exclude: [
        'getOptionValue',
        'getOptionLabel',
        'formatCreateLabel',
        'filterOption',
        'className',
        'components',
        'defaultValue',
        'id',
        'inputId',
        'onBlur',
        'onChange',
        'onCloseMenu',
        'onCreateOption',
        'onInputChange',
        'onKeyDown',
        'onOpenMenu',
        'prefix',
        'renderControl',
        'options',
        'isOptionDisabled',
        'aria-label',
        'noOptionsMessage',
        'menuPosition',
        'isValidNewOption',
        'value',
      ],
    },
  },
  args: {},
  argTypes: {},
};

export const Examples: Story = (args) => {
  const [value, setValue] = useState<Array<SelectableValue<string>>>();
  const options = generateOptions();

  return (
    <VariableMultiSelect
      options={options}
      value={value}
      onChange={(v) => {
        setValue(v);
        action('onChange')(v);
      }}
      {...args}
    />
  );
};

export default meta;
