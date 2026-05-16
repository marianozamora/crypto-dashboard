import { render, screen } from '@testing-library/react'
import { ErrorBoundary } from './ErrorBoundary'

const ThrowingComponent = (): JSX.Element => {
  throw new Error('test error')
}

describe('ErrorBoundary', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should render children when no error', () => {
    render(
      <ErrorBoundary fallback={<p>error</p>}>
        <p>content</p>
      </ErrorBoundary>,
    )
    expect(screen.getByText('content')).toBeInTheDocument()
  })

  it('should render fallback when child throws', () => {
    render(
      <ErrorBoundary fallback={<p>error fallback</p>}>
        <ThrowingComponent />
      </ErrorBoundary>,
    )
    expect(screen.getByText('error fallback')).toBeInTheDocument()
  })

  it('should not render children when error occurs', () => {
    render(
      <ErrorBoundary fallback={<p>fallback</p>}>
        <ThrowingComponent />
      </ErrorBoundary>,
    )
    expect(screen.queryByText('content')).not.toBeInTheDocument()
  })
})
