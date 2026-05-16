import { Controller, Get } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { FinnhubWsAdapter } from '../finnhub/finnhub-ws.adapter'
import { RatesGateway } from '../websocket/rates.gateway'

type HealthStatus = {
  readonly status: 'ok'
  readonly finnhubConnected: boolean
  readonly connectedClients: number
  readonly uptime: number
  readonly timestamp: string
}

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly finnhubWsAdapter: FinnhubWsAdapter,
    private readonly ratesGateway: RatesGateway,
  ) {}

  @ApiOperation({ summary: 'Check API health and connectivity status' })
  @ApiResponse({
    status: 200,
    description: 'API is healthy',
    schema: {
      example: {
        status: 'ok',
        finnhubConnected: true,
        connectedClients: 2,
        uptime: 3600,
        timestamp: '2025-01-15T10:00:00.000Z',
      },
    },
  })
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
