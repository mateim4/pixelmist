import type { Preview, Decorator } from '@storybook/react';
import React from 'react';
import '../src/app.css';
import '@pixelmist/tokens/tokens.css';
import '@pixelmist/react/styles.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on.*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'centered',
  },
  globals: {
    theme: {
      description: 'Global theme for components',
      defaultValue: 'daylight',
      toolbar: {
        title: 'Theme',
        items: [
          { value: 'daylight', title: 'Daylight' },
          { value: 'terminal', title: 'Terminal' },
        ],
        dynamicTitle: true,
      },
    },
  },
};

const withTheme: Decorator = (Story, context) => {
  const { theme } = context.globals;
  return (
    <html data-theme={theme as string}>
      <body>
        <Story {...context} />
      </body>
    </html>
  );
};

export const decorators = [withTheme];
export default preview;
