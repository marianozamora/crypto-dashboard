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
      <span className="section-label">{title}</span>
      {headerRight}
    </div>

    <div className="flex flex-col">{children}</div>

    {footer !== undefined && (
      <div className="border-t border-white/5 pt-3">{footer}</div>
    )}
  </div>
)

export { DataCard, type DataCardProps }
