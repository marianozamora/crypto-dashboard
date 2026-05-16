import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary'
import type { ReactNode } from 'react'
import { logger } from '@lib/logger/frontend-logger'

type ErrorBoundaryProps = {
  readonly children: ReactNode
  readonly fallback: ReactNode
  readonly name?: string
}

const ErrorBoundary = ({
  children,
  fallback,
  name = 'unknown',
}: ErrorBoundaryProps): JSX.Element => (
  <ReactErrorBoundary
    fallback={<>{fallback}</>}
    onError={(error: unknown) => {
      const message = error instanceof Error ? error.message : String(error)
      logger.error('widget_render_error', { name, error: message })
    }}
  >
    {children}
  </ReactErrorBoundary>
)

export { ErrorBoundary, type ErrorBoundaryProps }
