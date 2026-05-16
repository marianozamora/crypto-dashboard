import { Controller, Get } from '@nestjs/common'
import { FinnhubWsAdapter } from '../finnhub/finnhub-ws.adapter'
import { RatesGateway } from '../websocket/rates.gateway'

type HealthStatus = {
  readonly status: 'ok'
  readonly finnhubConnected: boolean
  readonly connectedClients: number
  readonly uptime: number
  readonly timestamp: string
}

@Controller('health')
export class HealthController {
  constructor(
    private readonly finnhubWsAdapter: FinnhubWsAdapter,
    private readonly ratesGateway: RatesGateway,
  ) {}

  @Get()
  check(): HealthStatus {
    return {
      status: 'ok',
      finnhubConnected: this.finnhubWsAdapter.isConnected(),
      connectedClients: this.ratesGateway.getConnectedClientCount(),
      uptime: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
    }
  }
}
