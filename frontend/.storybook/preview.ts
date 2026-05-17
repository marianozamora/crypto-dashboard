import type { Preview } from '@storybook/react'
import '../src/app/styles/globals.css'

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#0a0b0f' },
        { name: 'surface', value: '#111318' },
      ],
    },
    layout: 'centered',
  },
  globals: {
    backgrounds: { value: '#0a0b0f' },
  },
}

export default preview
