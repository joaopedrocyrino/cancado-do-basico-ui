import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Form } from './Form';
import { FormInput } from '../FormInput/FormInput';
import { FormRow } from '../FormRow/FormRow';
import { FormTextArea } from '../FormTextArea/FormTextArea';

const meta: Meta<typeof Form> = {
  title: 'Components/Form',
  component: Form,
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof Form>;

export const NewItem: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    const [name, setName] = useState('');
    const [notes, setNotes] = useState('');

    return (
      <>
        <button onClick={() => setOpen(true)} style={{ margin: 24 }}>Open Form</button>
        <Form
          open={open}
          title="New Item"
          onClose={() => setOpen(false)}
          onSubmit={async () => { await new Promise(r => setTimeout(r, 800)); setOpen(false); }}
          saveLabel="Create"
          cancelLabel="Cancel"
        >
          <FormRow>
            <FormInput title="Name" value={name} onChange={setName} required />
          </FormRow>
          <FormTextArea title="Notes" value={notes} onChange={setNotes} rows={3} />
        </Form>
      </>
    );
  },
};

export const EditWithDelete: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    const [name, setName] = useState('Existing Item');

    return (
      <>
        <button onClick={() => setOpen(true)} style={{ margin: 24 }}>Open Form</button>
        <Form
          open={open}
          title="Edit Item"
          onClose={() => setOpen(false)}
          onSubmit={async () => { await new Promise(r => setTimeout(r, 800)); setOpen(false); }}
          onDelete={() => { setOpen(false); }}
          saveLabel="Save"
          cancelLabel="Cancel"
          deleteLabel="Delete Item"
          deleteConfirmTitle="Delete Item?"
          deleteConfirmMessage="This will permanently delete the item. This action cannot be undone."
        >
          <FormInput title="Name" value={name} onChange={setName} required />
        </Form>
      </>
    );
  },
};
