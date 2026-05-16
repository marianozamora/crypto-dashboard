import { z } from 'zod'

const envSchema = z.object({
  FINNHUB_API_KEY: z.string().min(1),
  DATABASE_URL: z.string().url(),
  ANTHROPIC_API_KEY: z.string().min(1),
  PORT: z.coerce.number().default(3001),
  NODE_ENV: z.enum(['development', 'production', 'test']),
  FRONTEND_URL: z.string().url().default('http://localhost:5173'),
})

type Env = z.infer<typeof envSchema>

function validateEnv(config: Record<string, unknown>): Env {
  const result = envSchema.safeParse(config)
  if (!result.success) {
    throw new Error(`Config validation failed:\n${result.error.message}`)
  }
  return result.data
}

export { validateEnv }
export type { Env }
