type ProcessRateTickPort = {
  execute(pair: string, price: number, timestamp: number): Promise<void>
}

type GetHourlyAveragePort = {
  execute(pair: string): Promise<number | null>
}

export type { ProcessRateTickPort, GetHourlyAveragePort }
