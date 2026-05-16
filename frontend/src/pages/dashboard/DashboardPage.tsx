import type { CurrencyPair } from '@crypto/shared'
import { ConnectionStatus } from '@widgets/connection-status'
import { PairCard } from '@widgets/pair-card'
import { RateChart } from '@widgets/rate-chart'
import { CommentaryWidget } from '@widgets/commentary'
import { ErrorBoundary, ErrorFallback } from '@shared/ui'
import { CURRENCY_PAIRS } from '@config/constants'

const buildPairCardFallback = (pair: CurrencyPair): JSX.Element => (
  <ErrorFallback message={`Failed to load ${pair} card`} />
)

const buildChartFallback = (pair: CurrencyPair): JSX.Element => (
  <ErrorFallback message={`Failed to load ${pair} chart`} />
)

const DashboardPage = (): JSX.Element => (
  <div className="min-h-screen bg-surface">
    <header className="border-b border-white/5 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-accent-blue text-xl">◈</span>
          <h1 className="text-white font-semibold text-lg tracking-tight">cryptostream</h1>
        </div>
        <ErrorBoundary
          name="connection-status"
          fallback={<ErrorFallback message="Connection status unavailable" />}
        >
          <ConnectionStatus />
        </ErrorBoundary>
      </div>
    </header>

    <main className="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-8">
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4" aria-label="Current exchange rates">
        {CURRENCY_PAIRS.map((pair) => (
          <ErrorBoundary key={pair} name={`pair-card-${pair}`} fallback={buildPairCardFallback(pair)}>
            <PairCard pair={pair} />
          </ErrorBoundary>
        ))}
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4" aria-label="Price charts">
        {CURRENCY_PAIRS.map((pair) => (
          <ErrorBoundary key={pair} name={`rate-chart-${pair}`} fallback={buildChartFallback(pair)}>
            <RateChart pair={pair} />
          </ErrorBoundary>
        ))}
      </section>

      <section aria-label="AI market commentary">
        <ErrorBoundary name="commentary" fallback={<ErrorFallback message="Commentary unavailable" />}>
          <CommentaryWidget />
        </ErrorBoundary>
      </section>
    </main>
  </div>
)

export { DashboardPage }
