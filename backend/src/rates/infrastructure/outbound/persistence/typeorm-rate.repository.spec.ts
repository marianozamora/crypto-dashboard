vi.mock('./entities/rate.orm-entity', () => ({ RateOrmEntity: class RateOrmEntity {} }))
vi.mock('./entities/hourly-average.orm-entity', () => ({ HourlyAverageOrmEntity: class HourlyAverageOrmEntity {} }))

import { TypeOrmRateRepository } from './typeorm-rate.repository'
import type { RateOrmEntity } from './entities/rate.orm-entity'
import type { HourlyAverageOrmEntity } from './entities/hourly-average.orm-entity'
import { createPrice } from '@domain/value-objects/price.vo'
import { createRate } from '@domain/entities/rate.entity'
import { createHourlyAverage } from '@domain/entities/hourly-average.entity'
import type { Repository } from 'typeorm'

type MockRepo = { save: ReturnType<typeof vi.fn>; findOne: ReturnType<typeof vi.fn> }

const NOW = Date.now()

describe('TypeOrmRateRepository', () => {
  let repository: TypeOrmRateRepository
  let mockRateRepo: MockRepo
  let mockAvgRepo: MockRepo

  beforeEach(() => {
    mockRateRepo = { save: vi.fn().mockResolvedValue(undefined), findOne: vi.fn() }
    mockAvgRepo = { save: vi.fn().mockResolvedValue(undefined), findOne: vi.fn() }
    repository = new TypeOrmRateRepository(
      mockRateRepo as unknown as Repository<RateOrmEntity>,
      mockAvgRepo as unknown as Repository<HourlyAverageOrmEntity>,
    )
  })

  describe('save', () => {
    it('should map domain Rate to ORM shape and save', async () => {
      const rate = createRate('ETH/USDT', createPrice(3_000), NOW)
      await repository.save(rate)
      expect(mockRateRepo.save).toHaveBeenCalledWith({ pair: 'ETH/USDT', price: 3_000, timestamp: NOW })
    })
  })

  describe('findHourlyAverage', () => {
    it('should return numeric average when record found', async () => {
      mockAvgRepo.findOne.mockResolvedValue({ average: '2500.12345678' })
      const result = await repository.findHourlyAverage('ETH/USDT')
      expect(result).toBeCloseTo(2_500.12345678)
    })

    it('should return null when no record found', async () => {
      mockAvgRepo.findOne.mockResolvedValue(null)
      const result = await repository.findHourlyAverage('ETH/USDT')
      expect(result).toBeNull()
    })

    it('should order by createdAt DESC', async () => {
      mockAvgRepo.findOne.mockResolvedValue(null)
      await repository.findHourlyAverage('ETH/USDT')
      expect(mockAvgRepo.findOne).toHaveBeenCalledWith({
        where: { pair: 'ETH/USDT' },
        order: { createdAt: 'DESC' },
      })
    })
  })

  describe('saveHourlyAverage', () => {
    it('should map HourlyAverage to ORM shape and save', async () => {
      const average = createHourlyAverage('ETH/USDT', 2_500, '2025-01-01T00:00:00Z', '2025-01-01T01:00:00Z')
      await repository.saveHourlyAverage(average)
      expect(mockAvgRepo.save).toHaveBeenCalledWith({
        pair: 'ETH/USDT',
        average: 2_500,
        periodStart: '2025-01-01T00:00:00Z',
        periodEnd: '2025-01-01T01:00:00Z',
      })
    })
  })
})
