import { useCommentaryStore } from '../store/commentary.store'
import type { MarketCommentary } from '@crypto/shared'

type UseCommentaryReturn = {
  readonly commentary: MarketCommentary | null
  readonly hasCommentary: boolean
}

const useCommentary = (): UseCommentaryReturn => {
  const commentary = useCommentaryStore((state) => state.commentary)
  return {
    commentary,
    hasCommentary: commentary !== null,
  }
}

export { useCommentary, type UseCommentaryReturn }
