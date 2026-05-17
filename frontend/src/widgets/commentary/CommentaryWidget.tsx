import { Spinner } from '@atoms/Spinner'
import { useCommentary } from '@features/commentary/hooks/useCommentary'
import { formatTimestamp } from '@lib/utils/format'

const CommentaryWidget = (): JSX.Element => {
  const { commentary, hasCommentary } = useCommentary()

  return (
    <div
      className="bg-surface border border-accent-purple/20 border-l-2 border-l-accent-purple rounded-2xl p-5"
      data-testid="commentary-widget"
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-accent-purple text-sm">◈</span>
        <span className="section-label">AI Market Commentary</span>
      </div>

      {!hasCommentary ? (
        <div className="flex items-center gap-3" data-testid="commentary-loading">
          <Spinner size="sm" />
          <span className="text-white/30 text-sm font-mono">
            Commentary generates every hour...
          </span>
        </div>
      ) : (
        <>
          <p
            className="text-white/70 text-sm leading-relaxed italic"
            data-testid="commentary-text"
          >
            {commentary?.text}
          </p>
          <span className="text-white/20 text-xs font-mono mt-3 block">
            Generated at {formatTimestamp(
              commentary !== null ? new Date(commentary.generatedAt).getTime() : null,
            )}
          </span>
        </>
      )}
    </div>
  )
}

export { CommentaryWidget }
