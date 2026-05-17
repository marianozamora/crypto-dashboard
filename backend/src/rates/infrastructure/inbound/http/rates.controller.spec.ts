import { BadRequestException } from '@nestjs/common'
import { RatesController } from './rates.controller'
import { InvalidCurrencyPairError } from '@domain/value-objects/currency-pair.vo'
import type { GetHourlyAverageUseCase } from '@application/use-cases/get-hourly-average.use-case'

type MockUseCase = { execute: ReturnType<typeof vi.fn> }

describe('RatesController', () => {
  let controller: RatesController
  let mockUseCase: MockUseCase

  beforeEach(() => {
    mockUseCase = { execute: vi.fn() }
    controller = new RatesController(mockUseCase as unknown as GetHourlyAverageUseCase)
  })

  describe('getAverage', () => {
    it('should return pair and average when use case resolves a value', async () => {
      mockUseCase.execute.mockResolvedValue(2310.5)
      const result = await controller.getAverage('ETH-USDC')
      expect(result).toEqual({ pair: 'ETH/USDC', average: 2310.5 })
    })

    it('should normalize hyphen-separated pair to slash-separated before calling use case', async () => {
      mockUseCase.execute.mockResolvedValue(null)
      await controller.getAverage('ETH-USDT')
      expect(mockUseCase.execute).toHaveBeenCalledWith('ETH/USDT')
    })

    it('should return null average when no hourly average exists yet', async () => {
      mockUseCase.execute.mockResolvedValue(null)
      const result = await controller.getAverage('ETH-BTC')
      expect(result).toEqual({ pair: 'ETH/BTC', average: null })
    })

    it('should throw BadRequestException when pair is invalid', async () => {
      mockUseCase.execute.mockRejectedValue(new InvalidCurrencyPairError('ETH-FAKE'))
      await expect(controller.getAverage('ETH-FAKE')).rejects.toBeInstanceOf(BadRequestException)
    })

    it('should rethrow unexpected errors without wrapping', async () => {
      const unexpected = new Error('DB timeout')
      mockUseCase.execute.mockRejectedValue(unexpected)
      await expect(controller.getAverage('ETH-USDC')).rejects.toBe(unexpected)
    })
  })
})
