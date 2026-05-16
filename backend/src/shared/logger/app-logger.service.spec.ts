import { Logger } from '@nestjs/common'
import { AppLoggerService } from './app-logger.service'

describe('AppLoggerService', () => {
  let service: AppLoggerService
  let logSpy: ReturnType<typeof vi.spyOn>
  let warnSpy: ReturnType<typeof vi.spyOn>
  let errorSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    logSpy = vi.spyOn(Logger.prototype, 'log').mockImplementation(() => undefined)
    warnSpy = vi.spyOn(Logger.prototype, 'warn').mockImplementation(() => undefined)
    errorSpy = vi.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined)
    service = new AppLoggerService()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should log rate_tick event with pair and price', () => {
    service.logRateTick('ETH/USDT', 3_000)
    expect(logSpy).toHaveBeenCalledOnce()
    const logged = JSON.parse(logSpy.mock.calls[0][0] as string)
    expect(logged).toMatchObject({ event: 'rate_tick', pair: 'ETH/USDT', price: 3_000 })
  })

  it('should warn reconnection_attempt with attempt and delay', () => {
    service.logReconnectionAttempt(2, 4_000)
    expect(warnSpy).toHaveBeenCalledOnce()
    const logged = JSON.parse(warnSpy.mock.calls[0][0] as string)
    expect(logged).toMatchObject({ event: 'reconnection_attempt', attempt: 2, delayMs: 4_000 })
  })

  it('should log client_connected event', () => {
    service.logClientConnected('abc123')
    const logged = JSON.parse(logSpy.mock.calls[0][0] as string)
    expect(logged).toMatchObject({ event: 'client_connected', clientId: 'abc123' })
  })

  it('should log client_disconnected event', () => {
    service.logClientDisconnected('abc123')
    const logged = JSON.parse(logSpy.mock.calls[0][0] as string)
    expect(logged).toMatchObject({ event: 'client_disconnected', clientId: 'abc123' })
  })

  it('should log hourly_average_calculated event', () => {
    service.logHourlyAverageCalculated('ETH/USDT', 2_500)
    const logged = JSON.parse(logSpy.mock.calls[0][0] as string)
    expect(logged).toMatchObject({ event: 'hourly_average_calculated', pair: 'ETH/USDT', average: 2_500 })
  })

  it('should log commentary_emitted event', () => {
    service.logCommentaryEmitted('2025-01-01T00:00:00.000Z')
    const logged = JSON.parse(logSpy.mock.calls[0][0] as string)
    expect(logged).toMatchObject({ event: 'commentary_emitted', generatedAt: '2025-01-01T00:00:00.000Z' })
  })

  it('should log error message from Error instance', () => {
    service.logError('test_event', new Error('something broke'))
    const logged = JSON.parse(errorSpy.mock.calls[0][0] as string)
    expect(logged).toMatchObject({ event: 'test_event', error: 'something broke' })
  })

  it('should log error message from non-Error value', () => {
    service.logError('test_event', 'raw string error')
    const logged = JSON.parse(errorSpy.mock.calls[0][0] as string)
    expect(logged).toMatchObject({ event: 'test_event', error: 'raw string error' })
  })
})
