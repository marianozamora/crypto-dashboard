import type { MarketCommentary } from '@crypto/shared'
import type { CurrencyPairValue } from '../../../../rates/domain/value-objects/currency-pair.vo'

type CommentaryInputPair = {
  readonly name: CurrencyPairValue
  readonly currentPrice: number
  readonly hourlyAverage: number | null
  readonly changePercent: number | null
}

type CommentaryInput = {
  readonly pairs: readonly CommentaryInputPair[]
  readonly generatedAt: Date
}

type AiCommentaryPort = {
  generateCommentary(input: CommentaryInput): Promise<MarketCommentary>
}

const AI_COMMENTARY_PORT = Symbol('AiCommentaryPort')

export { AI_COMMENTARY_PORT }
export type { CommentaryInputPair, CommentaryInput, AiCommentaryPort }
