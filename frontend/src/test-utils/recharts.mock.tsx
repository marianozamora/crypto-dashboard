const rechartsStubs = {
  LineChart: ({ children }: { children: React.ReactNode }): JSX.Element => <div>{children}</div>,
  Line: (): null => null,
  XAxis: (): null => null,
  YAxis: (): null => null,
  CartesianGrid: (): null => null,
  Tooltip: (): null => null,
  ResponsiveContainer: ({ children }: { children: React.ReactNode }): JSX.Element => (
    <div>{children}</div>
  ),
}

export { rechartsStubs }
