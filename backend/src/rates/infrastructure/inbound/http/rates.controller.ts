import { Controller, Get, Inject, Param, BadRequestException } from '@nestjs/common'
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import {
  GET_HOURLY_AVERAGE_USE_CASE,
} from '@application/use-cases/get-hourly-average.use-case'
import type { GetHourlyAverageUseCase } from '@application/use-cases/get-hourly-average.use-case'
import { InvalidCurrencyPairError } from '@domain/value-objects/currency-pair.vo'

type HourlyAverageResponse = {
  readonly pair: string
  readonly average: number | null
}

@ApiTags('rates')
@Controller('rates')
export class RatesController {
  constructor(
    @Inject(GET_HOURLY_AVERAGE_USE_CASE)
    private readonly getHourlyAverageUseCase: GetHourlyAverageUseCase,
  ) {}

  @Get(':pair/average')
  @ApiOperation({ summary: 'Get the last persisted hourly average for a currency pair' })
  @ApiParam({
    name: 'pair',
    example: 'ETH-USDC',
    description: 'Currency pair with hyphen separator. Valid: ETH-USDC, ETH-USDT, ETH-BTC',
  })
  @ApiResponse({
    status: 200,
    description: 'Hourly average for the pair. Returns null if not yet calculated.',
    schema: { example: { pair: 'ETH/USDC', average: 2310.5 } },
  })
  @ApiResponse({ status: 400, description: 'Invalid currency pair' })
  async getAverage(@Param('pair') pair: string): Promise<HourlyAverageResponse> {
    const normalizedPair = pair.replace('-', '/')
    try {
      const average = await this.getHourlyAverageUseCase.execute(normalizedPair)
      return { pair: normalizedPair, average }
    } catch (error) {
      if (error instanceof InvalidCurrencyPairError) throw new BadRequestException(error.message)
      throw error
    }
  }
}
