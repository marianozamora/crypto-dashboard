import type { CurrencyPair } from '@crypto/shared'
import { ConnectionStatus } from '@widgets/connection-status'
import { PairCard } from '@widgets/pair-card'
import { CommentaryWidget } from '@widgets/commentary'
import { ErrorBoundary, ErrorFallback } from '@shared/ui'
import { CURRENCY_PAIRS } from '@config/constants'

const buildPairFallback = (pair: CurrencyPair): JSX.Element => (
  <div className="card">
    <ErrorFallback message={`Failed to load ${pair}`} />
  </div>
)

const DashboardPage = (): JSX.Element => (
  <div className="min-h-screen bg-surface-deep">

    <header className="h-14 border-b border-white/5 bg-surface-deep sticky top-0 z-10 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-accent-blue text-lg">◈</span>
          <h1 className="font-mono font-semibold text-white tracking-tight">cryptostream</h1>
        </div>
        <ErrorBoundary
          name="connection-status"
          fallback={<span className="text-white/20 text-xs font-mono">—</span>}
        >
          <ConnectionStatus />
        </ErrorBoundary>
      </div>
    </header>

    <main className="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-6">

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4" aria-label="Exchange rates">
        {CURRENCY_PAIRS.map((pair) => (
          <ErrorBoundary key={pair} name={`pair-card-${pair}`} fallback={buildPairFallback(pair)}>
            <PairCard pair={pair} />
          </ErrorBoundary>
        ))}
      </section>

      <section aria-label="AI market commentary">
        <ErrorBoundary
          name="commentary"
          fallback={
            <div className="card border-accent-purple/20">
              <ErrorFallback message="Commentary unavailable" />
            </div>
          }
        >
          <CommentaryWidget />
        </ErrorBoundary>
      </section>

    </main>
  </div>
)

export { DashboardPage }
