import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Modal } from './Modal';

const meta: Meta<typeof Modal> = {
  title: 'Components/Modal',
  component: Modal,
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <>
        <button onClick={() => setOpen(true)} style={{ margin: 24 }}>Open Modal</button>
        <Modal open={open} title="Example Modal" onClose={() => setOpen(false)}>
          <div style={{ padding: '20px' }}>
            <p style={{ color: 'var(--label-primary)', margin: 0 }}>
              This is the modal content. It scrolls independently of the page.
            </p>
          </div>
        </Modal>
      </>
    );
  },
};
