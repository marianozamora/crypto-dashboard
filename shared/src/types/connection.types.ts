import type { ConnectionState } from './rate.types'

type ConnectionStatus = {
  readonly state: ConnectionState
  readonly lastConnectedAt: string | null
  readonly reconnectAttempt: number
}

export type { ConnectionStatus }
