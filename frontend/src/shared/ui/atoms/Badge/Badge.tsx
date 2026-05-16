type BadgeVariant = 'connecting' | 'connected' | 'disconnected'

type BadgeProps = {
  readonly variant: BadgeVariant
}

type BadgeConfig = {
  readonly dot: string
  readonly text: string
  readonly label: string
}

const BADGE_CONFIG: Record<BadgeVariant, BadgeConfig> = {
  connecting: {
    dot: 'bg-accent-yellow animate-pulse-slow',
    text: 'text-accent-yellow',
    label: 'Connecting...',
  },
  connected: {
    dot: 'bg-accent-green',
    text: 'text-accent-green',
    label: 'Connected',
  },
  disconnected: {
    dot: 'bg-accent-red',
    text: 'text-accent-red',
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
      <span className={`w-2 h-2 rounded-full ${config.dot}`} />
      <span className={`text-sm font-medium ${config.text}`}>{config.label}</span>
    </div>
  )
}

export { Badge, type BadgeProps, type BadgeVariant }
