import { GetHourlyAverageUseCase } from './get-hourly-average.use-case'
import type { RateRepositoryPort } from '@domain/ports/outbound/rate-repository.port'
import { InvalidCurrencyPairError } from '@domain/value-objects/currency-pair.vo'

type MockRepository = { [K in keyof RateRepositoryPort]: ReturnType<typeof vi.fn> }

const createMockRepository = (): MockRepository => ({
  save: vi.fn().mockResolvedValue(undefined),
  findHourlyAverage: vi.fn().mockResolvedValue(null),
  saveHourlyAverage: vi.fn().mockResolvedValue(undefined),
})

describe('GetHourlyAverageUseCase', () => {
  let useCase: GetHourlyAverageUseCase
  let mockRepository: MockRepository

  beforeEach(() => {
    mockRepository = createMockRepository()
    useCase = new GetHourlyAverageUseCase(mockRepository as unknown as RateRepositoryPort)
  })

  it('should return null when no average exists in repository', async () => {
    mockRepository.findHourlyAverage.mockResolvedValue(null)
    const result = await useCase.execute('ETH/USDT')
    expect(result).toBeNull()
  })

  it('should return average when repository has data', async () => {
    mockRepository.findHourlyAverage.mockResolvedValue(3_200.5)
    const result = await useCase.execute('ETH/USDT')
    expect(result).toBe(3_200.5)
  })

  it('should throw InvalidCurrencyPairError when pair is invalid', async () => {
    await expect(useCase.execute('INVALID')).rejects.toThrow(InvalidCurrencyPairError)
    expect(mockRepository.findHourlyAverage).not.toHaveBeenCalled()
  })
})
