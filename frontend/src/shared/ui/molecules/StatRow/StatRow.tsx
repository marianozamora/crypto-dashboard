type StatRowProps = {
  readonly label: string
  readonly value: string | null
  readonly valueClassName?: string
}

const StatRow = ({ label, value, valueClassName }: StatRowProps): JSX.Element => (
  <div className="flex items-center justify-between py-1.5" data-testid="stat-row">
    <span className="stat-label">{label}</span>
    <span
      className={`stat-value ${valueClassName ?? 'text-white'}`}
      data-testid="stat-row-value"
    >
      {value ?? 'N/A'}
    </span>
  </div>
)

export { StatRow, type StatRowProps }
