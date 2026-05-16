const SOCKET_EVENTS = {
  RATE_UPDATE: 'rate_update',
  COMMENTARY_UPDATE: 'commentary_update',
  CONNECTION_STATE: 'connection_state',
} as const

type SocketEvent = (typeof SOCKET_EVENTS)[keyof typeof SOCKET_EVENTS]

export { SOCKET_EVENTS }
export type { SocketEvent }
