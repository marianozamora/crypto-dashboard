type ErrorFallbackProps = {
  readonly message?: string
}

const ErrorFallback = ({ message = 'Something went wrong' }: ErrorFallbackProps): JSX.Element => (
  <div className="flex flex-col items-center justify-center p-8 gap-2">
    <span className="text-accent-red/60 text-lg">⚠</span>
    <p className="text-white/30 text-xs font-mono">{message}</p>
  </div>
)

export { ErrorFallback, type ErrorFallbackProps }
