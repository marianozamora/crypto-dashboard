import type { Meta, StoryObj } from '@storybook/react'
import { expect, within, waitFor } from '@storybook/test'
import { RateChart } from './RateChart'
import { withTicks, generateTicks } from '@test-utils/storybook.decorators'
import { ETH_USDC_PRICE, ETH_BTC_PRICE } from '@test-utils/fixtures'
import { MAX_CHART_TICKS } from '@config/constants'

const meta: Meta<typeof RateChart> = {
  title: 'Widgets/RateChart',
  component: RateChart,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof RateChart>

export const WithData: Story = {
  args: { pair: 'ETH/USDC' },
  ...withTicks(generateTicks(30, 'ETH/USDC', ETH_USDC_PRICE)),
  play: async ({ canvasElement }): Promise<void> => {
    const canvas = within(canvasElement)
    await waitFor(
      () => expect(canvas.getByTestId('rate-chart-ETH-USDC')).toBeInTheDocument(),
      { timeout: 2_000 },
    )
    await expect(canvas.queryByTestId('chart-loading-ETH-USDC')).not.toBeInTheDocument()
  },
}

export const BTCPair: Story = {
  args: { pair: 'ETH/BTC' },
  ...withTicks(generateTicks(30, 'ETH/BTC', ETH_BTC_PRICE)),
  play: async ({ canvasElement }): Promise<void> => {
    const canvas = within(canvasElement)
    await waitFor(
      () => expect(canvas.getByTestId('rate-chart-ETH-BTC')).toBeInTheDocument(),
      { timeout: 2_000 },
    )
  },
}

export const Loading: Story = {
  args: { pair: 'ETH/USDC' },
  play: async ({ canvasElement }): Promise<void> => {
    const canvas = within(canvasElement)
    await expect(canvas.getByTestId('chart-loading-ETH-USDC')).toBeInTheDocument()
  },
}

export const FullBuffer: Story = {
  args: { pair: 'ETH/USDC' },
  ...withTicks(generateTicks(MAX_CHART_TICKS, 'ETH/USDC', ETH_USDC_PRICE)),
  play: async ({ canvasElement }): Promise<void> => {
    const canvas = within(canvasElement)
    await waitFor(
      () => expect(canvas.getByTestId('rate-chart-ETH-USDC')).toBeInTheDocument(),
      { timeout: 3_000 },
    )
  },
}
