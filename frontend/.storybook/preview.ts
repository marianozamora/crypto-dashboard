import type { Preview } from '@storybook/react'
import '../src/app/styles/globals.css'

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#0f1117' },
        { name: 'surface', value: '#1a1d27' },
      ],
    },
    layout: 'centered',
  },
}

export default preview
