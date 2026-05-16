type StatRowProps = {
  readonly label: string
  readonly value: string | null
  readonly valueClassName?: string
}

const StatRow = ({
  label,
  value,
  valueClassName = 'text-white',
}: StatRowProps): JSX.Element => (
  <div className="flex items-center justify-between py-1" data-testid="stat-row">
    <span className="text-white/40 text-sm">{label}</span>
    <span className={`text-sm font-mono ${valueClassName}`} data-testid="stat-row-value">
      {value ?? 'N/A'}
    </span>
  </div>
)

export { StatRow, type StatRowProps }
