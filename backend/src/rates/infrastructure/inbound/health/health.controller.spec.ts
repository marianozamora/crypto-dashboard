import { HealthController } from './health.controller'
import type { FinnhubWsAdapter } from '../finnhub/finnhub-ws.adapter'
import type { RatesGateway } from '../websocket/rates.gateway'

type MockFinnhub = { isConnected: ReturnType<typeof vi.fn> }
type MockGateway = { getConnectedClientCount: ReturnType<typeof vi.fn> }

describe('HealthController', () => {
  let controller: HealthController
  let mockFinnhub: MockFinnhub
  let mockGateway: MockGateway

  beforeEach(() => {
    mockFinnhub = { isConnected: vi.fn().mockReturnValue(true) }
    mockGateway = { getConnectedClientCount: vi.fn().mockReturnValue(5) }
    controller = new HealthController(
      mockFinnhub as unknown as FinnhubWsAdapter,
      mockGateway as unknown as RatesGateway,
    )
  })

  it('should return status ok with finnhub connected and client count', () => {
    const result = controller.check()
    expect(result.status).toBe('ok')
    expect(result.finnhubConnected).toBe(true)
    expect(result.connectedClients).toBe(5)
    expect(typeof result.uptime).toBe('number')
    expect(typeof result.timestamp).toBe('string')
  })

  it('should reflect finnhub disconnected state', () => {
    mockFinnhub.isConnected.mockReturnValue(false)
    const result = controller.check()
    expect(result.finnhubConnected).toBe(false)
  })

  it('should reflect zero connected clients', () => {
    mockGateway.getConnectedClientCount.mockReturnValue(0)
    const result = controller.check()
    expect(result.connectedClients).toBe(0)
  })
})
