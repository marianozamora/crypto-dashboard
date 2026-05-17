type BadgeVariant = 'connecting' | 'connected' | 'disconnected'

type BadgeProps = {
  readonly variant: BadgeVariant
}

type BadgeConfig = {
  readonly dotClass: string
  readonly textClass: string
  readonly label: string
}

const BADGE_CONFIG: Record<BadgeVariant, BadgeConfig> = {
  connecting: {
    dotClass: 'bg-accent-yellow animate-pulse-slow',
    textClass: 'text-accent-yellow',
    label: 'Connecting...',
  },
  connected: {
    dotClass: 'bg-accent-green',
    textClass: 'text-accent-green',
    label: 'Connected',
  },
  disconnected: {
    dotClass: 'bg-accent-red',
    textClass: 'text-accent-red',
    label: 'Disconnected',
  },
}

const Badge = ({ variant }: BadgeProps): JSX.Element => {
  const config = BADGE_CONFIG[variant]
  return (
    <div
      className="flex items-center gap-2"
      data-testid="badge"
      aria-label={`Connection status: ${config.label}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotClass}`} />
      <span className={`text-xs font-mono ${config.textClass}`}>{config.label}</span>
    </div>
  )
}

export { Badge, type BadgeProps, type BadgeVariant }
