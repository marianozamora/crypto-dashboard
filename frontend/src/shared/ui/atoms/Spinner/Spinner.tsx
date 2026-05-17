type SpinnerSize = 'sm' | 'md' | 'lg'

type SpinnerProps = {
  readonly size?: SpinnerSize
}

const SIZE_CLASSES: Record<SpinnerSize, string> = {
  sm: 'w-3 h-3 border',
  md: 'w-6 h-6 border-2',
  lg: 'w-10 h-10 border-2',
}

const Spinner = ({ size = 'md' }: SpinnerProps): JSX.Element => (
  <div
    className={`rounded-full border-white/10 border-t-accent-blue animate-spin ${SIZE_CLASSES[size]}`}
    data-testid="spinner"
    role="status"
    aria-label="Loading"
  />
)

export { Spinner, type SpinnerProps, type SpinnerSize }
