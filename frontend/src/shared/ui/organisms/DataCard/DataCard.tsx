import type { ReactNode } from 'react'

type DataCardProps = {
  readonly title: string
  readonly children: ReactNode
  readonly footer?: ReactNode
  readonly headerRight?: ReactNode
}

const DataCard = ({ title, children, footer, headerRight }: DataCardProps): JSX.Element => (
  <div className="card flex flex-col gap-4" data-testid="data-card">
    <div className="flex items-center justify-between">
      <h2 className="text-white/60 text-sm font-medium uppercase tracking-wider">{title}</h2>
      {headerRight}
    </div>

    <div className="flex flex-col gap-2">{children}</div>

    {footer !== undefined && (
      <div className="border-t border-white/5 pt-3">{footer}</div>
    )}
  </div>
)

export { DataCard, type DataCardProps }
