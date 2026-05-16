import { create } from 'zustand'
import type { MarketCommentary } from '@crypto/shared'

type CommentaryState = {
  readonly commentary: MarketCommentary | null
}

type CommentaryActions = {
  readonly setCommentary: (commentary: MarketCommentary) => void
}

type CommentaryStore = CommentaryState & CommentaryActions

const useCommentaryStore = create<CommentaryStore>((set) => ({
  commentary: null,
  setCommentary: (commentary: MarketCommentary): void => set({ commentary }),
}))

export { useCommentaryStore, type CommentaryStore }
