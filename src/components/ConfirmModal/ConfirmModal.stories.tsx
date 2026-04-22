import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { ConfirmModal } from './ConfirmModal';

const meta: Meta<typeof ConfirmModal> = {
  title: 'Components/ConfirmModal',
  component: ConfirmModal,
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof ConfirmModal>;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <>
        <button onClick={() => setOpen(true)} style={{ margin: 24 }}>Open Confirm</button>
        <ConfirmModal
          open={open}
          title="Are you sure?"
          message="This action cannot be undone."
          onConfirm={() => setOpen(false)}
          onCancel={() => setOpen(false)}
        />
      </>
    );
  },
};

export const Destructive: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <>
        <button onClick={() => setOpen(true)} style={{ margin: 24 }}>Open Confirm</button>
        <ConfirmModal
          open={open}
          title="Delete Record?"
          message="This will permanently delete the record and all associated data."
          confirmLabel="Delete"
          cancelLabel="Cancel"
          onConfirm={() => setOpen(false)}
          onCancel={() => setOpen(false)}
          destructive
        />
      </>
    );
  },
};
