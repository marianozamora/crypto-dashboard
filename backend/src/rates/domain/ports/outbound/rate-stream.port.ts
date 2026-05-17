import type { RateUpdate } from '@crypto/shared'

type RateStreamPort = {
  emit(update: RateUpdate): void
}

const RATE_STREAM_PORT = Symbol('RateStreamPort')

export { RATE_STREAM_PORT }
export type { RateStreamPort }
