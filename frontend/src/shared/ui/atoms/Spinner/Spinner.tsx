type SpinnerSize = 'sm' | 'md' | 'lg'

type SpinnerProps = {
  readonly size?: SpinnerSize
}

const SIZE_CLASSES: Record<SpinnerSize, string> = {
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-2',
  lg: 'w-12 h-12 border-4',
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
