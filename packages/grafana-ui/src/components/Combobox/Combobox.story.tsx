import { action } from '@storybook/addon-actions';
import { Meta, StoryFn, StoryObj } from '@storybook/react';
import { Chance } from 'chance';
import React, { ComponentProps, useEffect, useState } from 'react';

import { Alert } from '../Alert/Alert';
import { Field } from '../Forms/Field';
import { Input } from '../Input/Input';
import { Stack } from '../Layout/Stack/Stack';

import { Combobox, Option, Value } from './Combobox';
import { ComboboxCustomValue } from './ComboboxCustomValue';
import { LABEL_NAMES, LABEL_VALUES, METRICS } from './fixtures';

const chance = new Chance();

type PropsAndCustomArgs = ComponentProps<typeof Combobox> & { numberOfOptions: number; useCustomComponent: boolean };

const meta: Meta<PropsAndCustomArgs> = {
  title: 'Forms/Combobox',
  component: Combobox,
  args: {
    loading: undefined,
    invalid: undefined,
    width: 30,
    placeholder: 'Select an option...',
    options: [
      { label: 'Apple', value: 'apple' },
      { label: 'Banana', value: 'banana' },
      { label: 'Carrot', value: 'carrot' },
      // Long label to test overflow
      {
        label:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        value: 'long-text',
      },
      { label: 'Dill', value: 'dill' },
      { label: 'Eggplant', value: 'eggplant' },
      { label: 'Fennel', value: 'fennel' },
      { label: 'Grape', value: 'grape' },
      { label: 'Honeydew', value: 'honeydew' },
      { label: 'Iceberg Lettuce', value: 'iceberg-lettuce' },
      { label: 'Jackfruit', value: 'jackfruit' },
      { label: '1', value: 1 },
      { label: '2', value: 2 },
      { label: '3', value: 3 },
    ],
    value: 'banana',
  },

  render: (args) => <BasicWithState {...args} />,
  decorators: [InDevDecorator],
};

const BasicWithState: StoryFn<typeof Combobox> = (args) => {
  const [value, setValue] = useState(args.value);
  return (
    <Field label="Test input" description="Input with a few options">
      <Combobox
        id="test-combobox"
        {...args}
        value={value}
        onChange={(val) => {
          setValue(val?.value || null);
          action('onChange')(val);
        }}
      />
    </Field>
  );
};

type Story = StoryObj<typeof Combobox>;

export const Basic: Story = {};

async function generateOptions(amount: number): Promise<Option[]> {
  return Array.from({ length: amount }, (_, index) => ({
    label: chance.sentence({ words: index % 5 }),
    value: chance.guid(),
    //description: chance.sentence(),
  }));
}

const ManyOptionsStory: StoryFn<PropsAndCustomArgs> = ({ numberOfOptions, ...args }) => {
  const [value, setValue] = useState<Value | null>(null);
  const [options, setOptions] = useState<Option[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      generateOptions(numberOfOptions).then((options) => {
        setIsLoading(false);
        setOptions(options);
        setValue(options[5].value);
        console.log("I've set stuff");
      });
    }, 1000);
  }, [numberOfOptions]);

  return (
    <Combobox
      {...args}
      loading={isLoading}
      options={options}
      value={value}
      onChange={(opt) => {
        setValue(opt?.value || null);
        action('onChange')(opt);
      }}
    />
  );
};

export const ManyOptions: StoryObj<PropsAndCustomArgs> = {
  args: {
    numberOfOptions: 1e5,
    options: undefined,
    value: undefined,
  },
  render: ManyOptionsStory,
};

export const CustomValue: StoryObj<PropsAndCustomArgs> = {
  args: {
    createCustomValue: true,
  },
};

const OPERATORS = [
  { label: '=', value: '=' },
  { label: '!=', value: '!=' },
  { label: '=~', value: '=~' },
  { label: '~~', value: '~~' },
];

const LEGENDS = [
  { label: 'Auto', value: 'auto' },
  { label: 'Verbose', value: 'Verbose' },
  { label: 'Custom', value: 'Custom' },
];

const FORMATS = [
  { label: 'Time series', value: 'Time series' },
  { label: 'Table', value: 'Table' },
  { label: 'Heat map', value: 'Heat map' },
];

function CustomValueWrapper(props: any) {
  return <Combobox {...props} createCustomValue={true} />;
}

const CustomValueComponentStory: StoryFn<PropsAndCustomArgs> = ({ numberOfOptions, useCustomComponent, ...args }) => {
  const [metric, setMetric] = useState<Value | null>(null);
  const [labelName, setLabelName] = useState<Value | null>(null);
  const [labelValue, setLabelValue] = useState<Value | null>(null);
  const [legend, setLegend] = useState<Value | null>('auto');
  const [format, setFormat] = useState<Value | null>('Time series');
  const [customLabel, setCustomLabel] = useState<string | null>('{{name}}');

  const ComponentForCustomValue = useCustomComponent ? ComboboxCustomValue : CustomValueWrapper;

  return (
    <Stack direction="column">
      <Stack>
        <Field label="Metric">
          <ComponentForCustomValue
            options={METRICS}
            value={metric}
            width={20}
            placeholder="Select metric"
            onChange={(val) => {
              setMetric(val?.value || null);
              action('onChange')(val);
            }}
          />
        </Field>

        <Stack gap={0}>
          <Field label="Label filters">
            <ComponentForCustomValue
              options={LABEL_NAMES}
              value={labelName}
              placeholder="Select label"
              width={20}
              onChange={(val) => {
                setLabelName(val?.value || null);
                action('onChange')(val);
              }}
            />
          </Field>

          <Field label=" ">
            <Combobox
              value={'='}
              options={OPERATORS}
              width={10}
              onChange={(val) => {
                action('onChange')(val);
              }}
            />
          </Field>

          <Field label=" ">
            <ComponentForCustomValue
              options={LABEL_VALUES}
              value={labelValue}
              placeholder="Select value"
              width={20}
              onChange={(val) => {
                setLabelValue(val?.value || null);
                action('onChange')(val);
              }}
            />
          </Field>
        </Stack>
      </Stack>

      <Stack>
        <Field label="Legend">
          <Combobox width={20} options={LEGENDS} value={legend} onChange={(val) => setLegend(val?.value ?? null)} />
        </Field>

        {legend === 'Custom' && (
          <Field label="Custom label">
            <Input width={20} value={customLabel ?? ''} onChange={(ev) => setCustomLabel(ev.currentTarget.value)} />
          </Field>
        )}

        <Field label="Format">
          <Combobox width={20} options={FORMATS} value={format} onChange={(val) => setFormat(val?.value ?? null)} />
        </Field>
      </Stack>
    </Stack>
  );
};

export const CustomValueComponent: StoryObj<PropsAndCustomArgs> = {
  render: CustomValueComponentStory,
  args: {
    useCustomComponent: true,
  },
};

export default meta;

function InDevDecorator(Story: React.ElementType) {
  return (
    <div>
      <Alert title="This component is still in development!" severity="info">
        Combobox is still in development and not able to be used externally.
        <br />
        Within the Grafana repo, it can be used by importing it from{' '}
        <span style={{ fontFamily: 'monospace' }}>@grafana/ui/src/unstable</span>
      </Alert>
      <Story />
    </div>
  );
}
