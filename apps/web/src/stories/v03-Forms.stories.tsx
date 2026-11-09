import type { Meta, StoryObj } from '@storybook/react';
import { TextField, PasswordInput, Search, Select, ComboBox, Checkbox, RadioGroup, Radio, TextArea, DateInput } from '@pixelmist/react';

export const TextFieldStates: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 360 }}>
      <TextField label="Name" hint="How the run is labelled" />
      <TextField label="Secret" hideLabel placeholder="Visually hidden label" />
      <TextField label="Email" warning="Looks unusual" defaultValue="a@b" />
      <TextField label="Required" error="This field is required" />
      <TextField label="Read only" readOnly defaultValue="cannot edit" />
      <TextField label="Disabled" disabled placeholder="disabled" />
      <PasswordInput label="Password" />
      <Search placeholder="Search runs…" />
      <DateInput label="Due date" />
      <TextArea label="Notes" hint="Markdown supported" showCount maxLength={200} />
    </div>
  ),
};

export const SelectDemo: StoryObj = {
  render: () => {
    const items = [
      { id: 'goose', name: 'Goose' },
      { id: 'snooper', name: 'Snooper' },
      { id: 'shako', name: 'Shako' },
    ];
    return (
      <div style={{ display: 'flex', gap: 16, maxWidth: 360 }}>
        <Select label="Agent" items={items} itemToString={(i) => i.name} itemToValue={(i) => i.id} hint="Who runs it" />
        <ComboBox label="Project" items={['brdcrmb', 'pixelmist', 'shako']} itemToString={(s) => s} placeholder="Type to filter…" />
      </div>
    );
  },
};

export const CheckRadioDemo: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Checkbox label="Select all" indeterminate hint="2 of 5 selected" />
      <Checkbox label="Notify me" defaultChecked />
      <Checkbox label="Invalid one" error="Not allowed here" />
      <RadioGroup label="Density" hint="Pick one" defaultValue="md">
        <Radio value="sm" label="Compact" />
        <Radio value="md" label="Normal" />
        <Radio value="lg" label="Comfortable" />
      </RadioGroup>
    </div>
  ),
};

const meta: Meta = { title: 'Pixelmist/v0.3/Forms' };
export default meta;
