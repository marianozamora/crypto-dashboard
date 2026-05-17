import { useEffect } from 'react'
import type { StoryFn } from '@storybook/react'
import type { CurrencyPair, RateUpdate, MarketCommentary } from '@crypto/shared'
import { useRatesStore } from '@features/rates/store/rates.store'
import { useCommentaryStore } from '@features/commentary/store/commentary.store'

type Decorator = { decorators: ((Story: StoryFn) => JSX.Element)[] }

const withRate = (rate: RateUpdate | null): Decorator => ({
  decorators: [
    (Story: StoryFn): JSX.Element => {
      useEffect((): (() => void) => {
        if (rate !== null) useRatesStore.getState().updateRate(rate)
        return (): void => { useRatesStore.getState().reset() }
      }, [])
      return <Story />
    },
  ],
})

const withTicks = (ticks: readonly RateUpdate[]): Decorator => ({
  decorators: [
    (Story: StoryFn): JSX.Element => {
      useEffect((): (() => void) => {
        const { updateRate, reset } = useRatesStore.getState()
        ticks.forEach((t, i) => { setTimeout(() => { updateRate(t) }, i * 10) })
        return (): void => { reset() }
      }, [])
      return <Story />
    },
  ],
})

const withCommentary = (commentary: MarketCommentary | null): Decorator => ({
  decorators: [
    (Story: StoryFn): JSX.Element => {
      useEffect((): (() => void) => {
        if (commentary !== null) useCommentaryStore.getState().setCommentary(commentary)
        return (): void => { useCommentaryStore.setState({ commentary: null }) }
      }, [])
      return <Story />
    },
  ],
})

const generateTicks = (
  count: number,
  pair: CurrencyPair,
  basePrice: number,
): readonly RateUpdate[] =>
  Array.from({ length: count }, (_, i) => ({
    pair,
    price: basePrice + Math.sin(i * 0.3) * (basePrice * 0.02),
    timestamp: new Date(Date.now() - (count - i) * 2_000).toISOString(),
    hourlyAverage: basePrice,
  }))

export { withRate, withTicks, withCommentary, generateTicks }
