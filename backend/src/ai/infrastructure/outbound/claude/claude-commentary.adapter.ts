import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Anthropic from '@anthropic-ai/sdk'
import type { MarketCommentary } from '@crypto/shared'
import type { Env } from '@config/env.validation'
import type { AiCommentaryPort, CommentaryInput } from '@ai/domain/ports/outbound/ai-commentary.port'
import { CLAUDE_MODEL, CLAUDE_MAX_TOKENS, COMMENTARY_SYSTEM_PROMPT } from './claude.config'

@Injectable()
export class ClaudeCommentaryAdapter implements AiCommentaryPort {
  private readonly client: Anthropic

  constructor(configService: ConfigService<Env, true>) {
    this.client = new Anthropic({
      apiKey: configService.get('ANTHROPIC_API_KEY', { infer: true }),
    })
  }

  async generateCommentary(input: CommentaryInput): Promise<MarketCommentary> {
    const response = await this.client.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: CLAUDE_MAX_TOKENS,
      system: COMMENTARY_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: buildPrompt(input) }],
    })
    return extractCommentary(response, input)
  }
}

function buildPrompt(input: CommentaryInput): string {
  const lines = input.pairs.map(
    (p) =>
      `${p.name}: price=${p.currentPrice ?? 'N/A'}, avg=${p.hourlyAverage ?? 'N/A'}, ` +
      `change=${p.changePercent !== null ? `${p.changePercent.toFixed(2)}%` : 'N/A'}`,
  )
  return `Market data as of ${input.generatedAt.toISOString()}:\n${lines.join('\n')}`
}

function extractCommentary(response: Anthropic.Message, input: CommentaryInput): MarketCommentary {
  const block = response.content.find((b) => b.type === 'text')
  if (!block || block.type !== 'text') throw new Error('No text block in AI response')
  return {
    text: block.text,
    generatedAt: input.generatedAt.toISOString(),
    pairs: input.pairs.map((p) => p.name),
  }
}
