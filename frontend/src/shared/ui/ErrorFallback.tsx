type ErrorFallbackProps = {
  readonly message?: string
}

const ErrorFallback = ({ message = 'Something went wrong' }: ErrorFallbackProps): JSX.Element => (
  <div className="card flex flex-col items-center justify-center p-8 gap-2">
    <span className="text-accent-red text-2xl">⚠</span>
    <p className="text-white/50 text-sm">{message}</p>
  </div>
)

export { ErrorFallback, type ErrorFallbackProps }
