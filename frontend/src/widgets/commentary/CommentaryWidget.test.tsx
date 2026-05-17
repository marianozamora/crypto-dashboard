import { render, screen, act } from '@testing-library/react'
import { CommentaryWidget } from './CommentaryWidget'
import { useCommentaryStore } from '@features/commentary/store/commentary.store'
import { MOCK_COMMENTARY } from '@test-utils/fixtures'

describe('CommentaryWidget', () => {
  beforeEach(() => {
    useCommentaryStore.setState({ commentary: null })
  })

  it('should show loading state when no commentary', () => {
    render(<CommentaryWidget />)
    expect(screen.getByTestId('commentary-loading')).toBeInTheDocument()
  })

  it('should show loading message text', () => {
    render(<CommentaryWidget />)
    expect(screen.getByText('Commentary generates every hour...')).toBeInTheDocument()
  })

  it('should show commentary text when available', () => {
    act(() => { useCommentaryStore.getState().setCommentary(MOCK_COMMENTARY) })
    render(<CommentaryWidget />)
    expect(screen.getByTestId('commentary-text')).toHaveTextContent(MOCK_COMMENTARY.text)
  })

  it('should show title in both states', () => {
    render(<CommentaryWidget />)
    expect(screen.getByText('AI Market Commentary')).toBeInTheDocument()
  })

  it('should show generated timestamp when commentary is present', () => {
    act(() => { useCommentaryStore.getState().setCommentary(MOCK_COMMENTARY) })
    render(<CommentaryWidget />)
    expect(screen.getByText(/Generated at/)).toBeInTheDocument()
  })
})
