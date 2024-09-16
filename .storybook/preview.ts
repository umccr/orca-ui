import type { Preview } from '@storybook/react';
import '../src/styles/main.css';
import 'react-toastify/dist/ReactToastify.css';
import '@xyflow/react/dist/style.css';
import 'flatpickr/dist/flatpickr.min.css';
import '../src/styles/additional-styles/utility-patterns.css';
import '../src/styles/additional-styles/flatpickr.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
