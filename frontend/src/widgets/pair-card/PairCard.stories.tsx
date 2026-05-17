import type { Meta, StoryObj } from '@storybook/react'
import { expect, within, waitFor } from '@storybook/test'
import { PairCard } from './PairCard'
import { withRate } from '@test-utils/storybook.decorators'
import {
  ETH_USDC_RATE,
  ETH_USDC_RATE_ABOVE_AVG,
  ETH_USDC_RATE_BELOW_AVG,
  ETH_BTC_RATE,
  EXPECTED_ETH_USDC_PRICE,
  EXPECTED_CHANGE_ABOVE_AVG,
  EXPECTED_CHANGE_BELOW_AVG,
} from '@test-utils/fixtures'

const meta: Meta<typeof PairCard> = {
  title: 'Widgets/PairCard',
  component: PairCard,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof PairCard>

export const LiveData: Story = {
  args: { pair: 'ETH/USDC' },
  ...withRate({ ...ETH_USDC_RATE, timestamp: new Date().toISOString() }),
  play: async ({ canvasElement }): Promise<void> => {
    const canvas = within(canvasElement)
    await waitFor(() => expect(canvas.getByTestId('price-tag')).toBeInTheDocument())
    await expect(canvas.getByTestId('price-tag')).toHaveTextContent(EXPECTED_ETH_USDC_PRICE)
  },
}

export const PriceAboveAverage: Story = {
  args: { pair: 'ETH/USDC' },
  ...withRate({ ...ETH_USDC_RATE_ABOVE_AVG, timestamp: new Date().toISOString() }),
  play: async ({ canvasElement }): Promise<void> => {
    const canvas = within(canvasElement)
    await waitFor(() => expect(canvas.getAllByTestId('stat-row-value')[1]).toBeInTheDocument())
    await expect(canvas.getAllByTestId('stat-row-value')[1]).toHaveTextContent(EXPECTED_CHANGE_ABOVE_AVG)
  },
}

export const PriceBelowAverage: Story = {
  args: { pair: 'ETH/USDC' },
  ...withRate({ ...ETH_USDC_RATE_BELOW_AVG, timestamp: new Date().toISOString() }),
  play: async ({ canvasElement }): Promise<void> => {
    const canvas = within(canvasElement)
    await waitFor(() => expect(canvas.getAllByTestId('stat-row-value')[1]).toBeInTheDocument())
    await expect(canvas.getAllByTestId('stat-row-value')[1]).toHaveTextContent(EXPECTED_CHANGE_BELOW_AVG)
  },
}

export const BTCPair: Story = {
  args: { pair: 'ETH/BTC' },
  ...withRate({ ...ETH_BTC_RATE, timestamp: new Date().toISOString() }),
  play: async ({ canvasElement }): Promise<void> => {
    const canvas = within(canvasElement)
    await waitFor(() => expect(canvas.getByTestId('price-tag')).toBeInTheDocument())
    await expect(canvas.getByTestId('price-tag')).toHaveTextContent('₿')
  },
}

export const Loading: Story = {
  args: { pair: 'ETH/USDC' },
  ...withRate(null),
  play: async ({ canvasElement }): Promise<void> => {
    const canvas = within(canvasElement)
    await expect(canvas.getByTestId('price-tag-skeleton')).toBeInTheDocument()
    await expect(canvas.getByTestId('chart-loading-ETH-USDC')).toBeInTheDocument()
  },
}
