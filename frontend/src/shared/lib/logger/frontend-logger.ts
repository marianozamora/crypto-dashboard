type LogLevel = 'info' | 'warn' | 'error'

type LogEntry = {
  readonly level: LogLevel
  readonly event: string
  readonly context?: Record<string, unknown>
  readonly timestamp: string
}

const isDev = (): boolean => import.meta.env.DEV === true

const formatEntry = (
  level: LogLevel,
  event: string,
  context?: Record<string, unknown>,
): LogEntry => {
  const base = { level, event, timestamp: new Date().toISOString() }
  return context !== undefined ? { ...base, context } : base
}

const log = (level: LogLevel, event: string, context?: Record<string, unknown>): void => {
  if (!isDev()) return
  const entry = formatEntry(level, event, context)
  // eslint-disable-next-line no-console
  console[level](JSON.stringify(entry, null, 2))
}

const logger = {
  info: (event: string, context?: Record<string, unknown>): void =>
    log('info', event, context),
  warn: (event: string, context?: Record<string, unknown>): void =>
    log('warn', event, context),
  error: (event: string, context?: Record<string, unknown>): void =>
    log('error', event, context),
} as const

export { logger, type LogEntry, type LogLevel }
