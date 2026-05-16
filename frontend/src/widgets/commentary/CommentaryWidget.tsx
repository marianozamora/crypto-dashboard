import { DataCard } from '@organisms/DataCard'
import { Spinner } from '@atoms/Spinner'
import { useCommentary } from '@features/commentary/hooks/useCommentary'
import { formatTimestamp } from '@lib/utils/format'

const CommentaryWidget = (): JSX.Element => {
  const { commentary, hasCommentary } = useCommentary()

  if (!hasCommentary) {
    return (
      <DataCard title="AI Market Commentary">
        <div className="flex items-center gap-3 text-white/30" data-testid="commentary-loading">
          <Spinner size="sm" />
          <span className="text-sm">Commentary generates every hour...</span>
        </div>
      </DataCard>
    )
  }

  return (
    <DataCard
      title="AI Market Commentary"
      footer={
        <span className="text-white/20 text-xs font-mono">
          Generated at {formatTimestamp(commentary !== null ? new Date(commentary.generatedAt).getTime() : null)}
        </span>
      }
    >
      <p className="text-white/70 text-sm leading-relaxed" data-testid="commentary-text">
        {commentary?.text}
      </p>
    </DataCard>
  )
}

export { CommentaryWidget }
