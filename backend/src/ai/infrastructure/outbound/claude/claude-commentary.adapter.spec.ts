import { ClaudeCommentaryAdapter } from './claude-commentary.adapter'
import type { ConfigService } from '@nestjs/config'
import type { Env } from '@config/env.validation'
import type { CommentaryInput } from '@ai/domain/ports/outbound/ai-commentary.port'

type MockConfigService = { get: ReturnType<typeof vi.fn> }
type MockMessages = { create: ReturnType<typeof vi.fn> }

let mockMessages: MockMessages

vi.mock('@anthropic-ai/sdk', () => ({
  default: vi.fn().mockImplementation(function () { return { messages: mockMessages } }),
}))

const MOCK_INPUT: CommentaryInput = {
  generatedAt: new Date('2025-01-01T00:00:00.000Z'),
  pairs: [
    { name: 'ETH/USDT', currentPrice: 3_000, hourlyAverage: 2_900, changePercent: 3.45 },
    { name: 'ETH/USDC', currentPrice: null, hourlyAverage: null, changePercent: null },
    { name: 'ETH/BTC', currentPrice: 0.05, hourlyAverage: 0.049, changePercent: 2.04 },
  ],
}

describe('ClaudeCommentaryAdapter', () => {
  let adapter: ClaudeCommentaryAdapter
  let mockConfigService: MockConfigService

  beforeEach(() => {
    mockMessages = {
      create: vi.fn().mockResolvedValue({
        content: [{ type: 'text', text: 'ETH markets show strong momentum.' }],
      }),
    }
    mockConfigService = { get: vi.fn().mockReturnValue('test-api-key') }
    adapter = new ClaudeCommentaryAdapter(mockConfigService as unknown as ConfigService<Env, true>)
  })

  it('should return market commentary with AI-generated text', async () => {
    const result = await adapter.generateCommentary(MOCK_INPUT)
    expect(result.text).toBe('ETH markets show strong momentum.')
    expect(result.generatedAt).toBe('2025-01-01T00:00:00.000Z')
    expect(result.pairs).toEqual(['ETH/USDT', 'ETH/USDC', 'ETH/BTC'])
  })

  it('should pass all three pairs in the prompt', async () => {
    await adapter.generateCommentary(MOCK_INPUT)
    const call = mockMessages.create.mock.calls[0][0] as { messages: { content: string }[] }
    const prompt = call.messages[0].content
    expect(prompt).toContain('ETH/USDT')
    expect(prompt).toContain('ETH/USDC')
    expect(prompt).toContain('ETH/BTC')
  })

  it('should render N/A for null prices in the prompt', async () => {
    await adapter.generateCommentary(MOCK_INPUT)
    const call = mockMessages.create.mock.calls[0][0] as { messages: { content: string }[] }
    const prompt = call.messages[0].content
    expect(prompt).toContain('N/A')
  })

  it('should throw when AI response contains no text block', async () => {
    mockMessages.create.mockResolvedValue({ content: [{ type: 'tool_use', id: 'x' }] })
    await expect(adapter.generateCommentary(MOCK_INPUT)).rejects.toThrow('No text block in AI response')
  })

  it('should throw when AI response content is empty', async () => {
    mockMessages.create.mockResolvedValue({ content: [] })
    await expect(adapter.generateCommentary(MOCK_INPUT)).rejects.toThrow('No text block in AI response')
  })
})
