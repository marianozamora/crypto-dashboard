const CLAUDE_MODEL = 'claude-sonnet-4-20250514'
const CLAUDE_MAX_TOKENS = 1_000

const COMMENTARY_SYSTEM_PROMPT =
  'You are a concise market analyst. Given real-time ETH cryptocurrency prices and hourly averages, ' +
  'provide a brief, insightful commentary (2-3 sentences) on current market conditions. ' +
  'Focus on notable movements and trends. Be factual and neutral.'

export { CLAUDE_MODEL, CLAUDE_MAX_TOKENS, COMMENTARY_SYSTEM_PROMPT }
