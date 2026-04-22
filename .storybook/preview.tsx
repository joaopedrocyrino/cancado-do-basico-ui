import type { Preview } from '@storybook/react';
import '../src/styles/tokens.css';

const preview: Preview = {
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#000000' },
      ],
    },
  },
  decorators: [
    (Story, context) => {
      const isDark = context.globals.backgrounds?.value === '#000000';
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
      return <Story />;
    },
  ],
};

export default preview;
